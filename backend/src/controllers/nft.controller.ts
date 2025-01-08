import Product from '../models/product.model';
import User from '../models/user.model';
import { Hex } from 'viem';
import { baseSepolia } from 'viem/chains';
import ProductNFT from '../../abi/ProductNFT.json';
import { generateTokenId, publicClient, walletClient } from '../libs/biconomy';
import transactionModel from '../models/transaction.model';
import { uploadNftImageToIpfs } from '../services/uploadNftImageToIpfs';
import { pinata } from '../libs/pinata';

// Enhanced helper function to safely convert BigInt to string
const convertBigIntToString = (value: any): any => {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }
  
  if (Array.isArray(value)) {
    return value.map(item => convertBigIntToString(item));
  }
  
  if (typeof value === 'object') {
    const converted: any = {};
    for (const [key, val] of Object.entries(value)) {
      converted[key] = convertBigIntToString(val);
    }
    return converted;
  }
  
  return value;
};

export const mintNFTForUser = async (req: any, res: any) => {
  try {
    const { productId, userAddress, code } = req.body;

    console.log('Mint request:', { productId, userAddress, code });
    // 1. Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (!product.contractAddress) {
      return res.status(400).json({ message: 'No contract deployed for this product.' });
    }

    // 2. Check the QR code is valid
    const qrObj = product.qrCodes.find((qr) => qr.code === code);
    if (!qrObj) {
      return res.status(400).json({ message: 'Invalid code' });
    }
    if (qrObj.claimed) {
      return res.status(400).json({ message: 'Already claimed / minted for this code' });
    }

    // generate a unique nft token id
    const tokenId = generateTokenId() as number;

    console.log({
      address: product.contractAddress,
      chainName: baseSepolia.name,
      functionName: 'mintTo',
      args: [userAddress, tokenId],
    })

    // before minting save the metadata of nft to IPFS
    // Update Transaction Model with data
    const user = await User.findOne({ smartAccountAddress: userAddress });
    const imageUrl = await uploadNftImageToIpfs(user?.username as string, product.type, tokenId);

    console.log('Image Url Inside NFT Controller:', imageUrl);
    
    await qrObj.save();

    const metadata = {
      name: product.name,
      description: product.type === 'kesar' ? 'Kesar NFT' : product.type === 'pashmeena' ? 'Pashmeena NFT' : 'WallNut NFT',
      image: imageUrl,
      attributes: [
        // Optional: Attributes can be an array if you have multiple key-value pairs
        {
          trait_type: 'Token ID',
          value: tokenId,
        },
        {
          trait_type: 'Receiver Address',
          value: userAddress,
        },
        {
          trait_type: 'Creator Address',
          value: product.creator as Hex,
        },
        {
          trait_type: 'Product Type',
          value: product.type,
        },
        {
          trait_type: 'Product Name',
          value: product.name,
        },
        {
          trait_type: 'Product Code',
          value: code,
        },
      ],
    };

    console.log('metadata', metadata);
    const metadataHash = await pinata.upload.json(metadata);
    console.log('metadataHash', metadataHash);
    const metadataUrl = `https://ipfs.io/ipfs/${metadataHash.IpfsHash}`;
    console.log('metadataUrl', metadataUrl);
    const txHash = await walletClient.writeContract({
      address: product.contractAddress as Hex,
      abi: ProductNFT.abi as any,
      chain: baseSepolia,
      functionName: 'mintTo',
      args: [userAddress, tokenId, metadataUrl],
    });

    // Convert and log transaction hash
    const stringTxHash = convertBigIntToString(txHash);

    // 4. Wait for transaction confirmation and convert the receipt
    const rawReceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    const receipt = convertBigIntToString(rawReceipt);
    
    if (!receipt.status) {
      return res.status(500).json({ message: 'Transaction failed' });
    }

    console.log('Transaction receipt:', receipt);
    const newTransaction = await transactionModel.create({
      user: user?._id, // Reference to the user's ObjectId
      product: product._id, // Reference to the product's ObjectId
      tokenId: tokenId,
      txHash: receipt.transactionHash,
      status: 'success',
    });

    user?.transactions.push(newTransaction._id);
    await user?.save()

    // 5. Query the contract and convert the result
    const rawToken = await publicClient.readContract({
      address: product.contractAddress as Hex,
      abi: ProductNFT.abi as any,
      functionName: 'getTokenId',
      args: [userAddress]
    });

    const token = convertBigIntToString(rawToken);

    // 6. Mark the QR as claimed
    qrObj.claimed = true;
    qrObj.claimedBy = userAddress;
    qrObj.mintedTokenId = token ? token.toString() : `${tokenId}`;
    await product.save();

    // 7. Update user's record
    const userDoc = await User.findOne({ smartAccountAddress: userAddress });
    if (userDoc) {
      userDoc.claims.push({
        product: product._id,
        tokenId: parseInt(token ? token.toString() : `${tokenId}`),
        claimedAt: new Date(),
        claimedNFTUrl: imageUrl
      });
      await userDoc.save();
    }

    // Prepare response object and convert all potential BigInts
    const responseObj = {
      message: 'NFT minted successfully',
      txHash: stringTxHash,
      tokenId: token ? token.toString() : `${tokenId}`,
      receipt: receipt // Including converted receipt for debugging
    };

    // Final conversion of the entire response object
    const safeResponse = convertBigIntToString(responseObj);
    
    // Log the final response for debugging
    console.log('Final response object:', JSON.stringify(safeResponse, null, 2));

    return res.status(200).json(safeResponse);
  } catch (error) {
    console.error('Error in mintNFTForUser:', error);
    // Log the full error object for debugging
    console.error('Full error:', JSON.stringify(error, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value
    ));
    return res.status(500).json({ message: 'Internal server error' });
  }
};

