import { pinata } from '../libs/pinata';
import Product from '../models/product.model';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode'
import { deployProductNFTContract } from '../services/nftDeployment.services';

// CREATE
export const createProduct = async (req: any, res: any) => {
  try {
    const {
      name,
      symbol,
      type,
      location,
      creator,
      dateOfCreation,
      expiryDate,
      latitude,
      longitude,
    } = req.body;

    const newProduct = new Product({
      name,
      symbol,
      type,
      location,
      creator,
      dateOfCreation,
      expiryDate,
      latitude,
      longitude,
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ALL
export const getAllProducts = async (req: any, res: any) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// READ ONE
export const getProductById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
export const updateProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      creator,
      dateOfCreation,
      expiryDate,
    } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        location,
        creator,
        dateOfCreation,
        expiryDate,
      },
      { new: true } // return the updated doc
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const deleteProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const deployNftForProduct = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    console.log('Product: ', product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // We'll use the product name and "PNFT" as symbol, for example.
    // You might want to store name/symbol in the product model as well.
    const name = product.name || 'MyNFT';
    const symbol = product.symbol || 'PNFT';
    const productId = `${product._id}`;
    const productType = product.type;
    const location = product.location;
    const creator = product.creator;
    const dateOfCreation = `${product.dateOfCreation}`;
    const expiryDate = `${product.expiryDate}`;
    const latitude = product.latitude;
    const longitude = product.longitude;
    
    const jsonIpfsMetadata = {
      name,
      symbol,
      productId,
      productType,
      location,
      creator,
      dateOfCreation,
      expiryDate,
      latitude,
      longitude,
    };
    
    const uploadToIpfs = await pinata.upload.json(jsonIpfsMetadata);

    const ipfsUrl = `https://ipfs.io/ipfs/${uploadToIpfs.IpfsHash}`;

    // Deploy the contract
    const contractAddress = await deployProductNFTContract(name, symbol, productId, productType, location, creator, dateOfCreation, expiryDate, latitude, longitude, ipfsUrl);

    // Update the product with the new contract address
    product.contractAddress = contractAddress;
    product.ipfsUrl = ipfsUrl;
    await product.save();

    return res.status(200).json({
      message: 'Contract deployed successfully',
      contractAddress,
    });
  } catch (error) {
    console.error('Error deploying contract for product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const generateProductQRCodes = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Let's generate 50 codes
    const qrCount = 50;
    const newCodes = [];
    for (let i = 0; i < qrCount; i++) {
      // You can also generate shorter codes if you like, e.g. substring of uuid
      newCodes.push({
        code: uuidv4(),
        claimed: false,
        claimedBy: null,
        mintedTokenId: null,
      });
    }

    product.qrCodes.push(...newCodes);
    await product.save();

    return res.status(200).json({
      message: `Generated ${qrCount} QR codes`,
      qrCodes: newCodes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getQRCodeImage = async (req: any, res: any) => {
  try {
    const { code } = req.params;

    // Here we search which product has that code in its qrCodes array.
    const product = await Product.findOne({ 'qrCodes.code': code });
    if (!product) {
      return res.status(404).send('Invalid QR code');
    }

    // The URL that the QR code points to (User Flow page).
    // For example: https://your-frontend.com/scan?code=XYZ
    // or a shorter route like https://your-frontend.com/p/XYZ
    const url = `http://localhost:5173/p/${code}`;

    // Generate QR as data URL or PNG buffer
    const qrDataUrl = await QRCode.toDataURL(url);

    // Convert base64 dataURL to actual image
    const img = Buffer.from(qrDataUrl.split(',')[1], 'base64');

    // Send as PNG
    res.setHeader('Content-Type', 'image/png');
    return res.send(img);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
};

export const getProductByQRCode = async (req: any, res: any) => {
  try {
    const { code } = req.params;
    // Find product that has qrCodes.code == code
    const product = await Product.findOne({ 'qrCodes.code': code });
    if (!product) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    // We can find the specific QR object
    const qrObj = product.qrCodes.find((qr) => qr.code === code);
    if (!qrObj) {
      return res.status(404).json({ message: 'Invalid QR code' });
    }

    return res.status(200).json({
      product,
      qrCode: qrObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

