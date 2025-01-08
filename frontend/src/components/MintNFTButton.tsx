/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "../components/ui/button"
import { Loader2, CheckCircle } from 'lucide-react';

interface MintProps {
  productId: string;
  userAddress: string;
  code: string;
  onSuccess?: () => void;  // Callback for successful mint
}

const MintNFTButton: React.FC<MintProps> = ({ productId, userAddress, code, onSuccess }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleMintNFT = async () => {
    if (!productId || !userAddress || !code) {
      setError('Missing product ID, user address, or code');
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      setError('User not authenticated. Please log in.');
      return;
    }

    try {
      setStatus('loading');
      setError(null);

      const response = await axios.post(
        'http://kashmir-traceability-backend.vercel.app/api/nft/mint',
        { productId, userAddress, code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setStatus('success');
      }
      
      // Wait for 2 seconds to show success state before triggering the callback
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);

    } catch (error: any) {
      console.error('Error minting NFT:', error);
      setStatus('error');
      setError(error.response?.data?.message || 'Error minting NFT');
    }
  };

  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting your NFT...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Minted Successfully!
          </>
        );
      case 'error':
        return 'Try Again';
      default:
        return 'Mint My NFT';
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleMintNFT}
        disabled={status === 'loading' || status === 'success'}
        className={`w-full ${
          status === 'success' 
            ? 'bg-green-600 hover:bg-green-700' 
            : status === 'error'
            ? 'bg-red-600 hover:bg-red-700'
            : ''
        }`}
      >
        {getButtonContent()}
      </Button>
      
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default MintNFTButton;