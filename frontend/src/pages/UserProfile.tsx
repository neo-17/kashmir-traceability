/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Key, Package, ExternalLink, Loader2, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

interface ClaimedProduct {
  product: {
    _id: string;
    name: string;
    contractAddress?: string;
    ipfsUrl?: string;
  };
  tokenId?: number;
  claimedAt?: string;
  claimedNFTUrl?: string;
}

interface Transaction {
  _id: string;
  user: string;
  product: string;
  tokenId: string;
  txHash: string;
  status: string;
}

interface User {
  _id: string;
  username: string;
  address?: string;
  smartAccountAddress?: string;
  claims: ClaimedProduct[];
  transactions: Transaction[];
}

interface UserProfileProps {
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pinForKey, setPinForKey] = useState('');
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  // Get token from localStorage
  const getAuthToken = () => localStorage.getItem('userToken');

  // Create axios instance with authorization header
  const axiosAuth = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add interceptor to handle unauthorized responses
  axiosAuth.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('jwt_token');
        navigate('/user/login');
      }
      return Promise.reject(error);
    }
  );

  // Add interceptor to add token to requests
  axiosAuth.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    // Check for token before fetching profile
    const token = getAuthToken();
    if (!token) {
      navigate('/user/login');
      return;
    }
    fetchUserProfile();
  }, [username, navigate]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await axiosAuth.get(`/api/users/profile/${username}`);
      console.log('User profile:', res.data);
      setUser(res.data.user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Error handling is managed by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleRevealKey = async () => {
    if (!pinForKey) {
      alert('Please enter your PIN');
      return;
    }
    setIsRevealing(true);
    try {
      const res = await axiosAuth.post(`/api/users/reveal-key`, {
        username,
        pin: pinForKey,
      });
      setRevealedKey(res.data.privateKey);
    } catch (error) {
      console.error('Error revealing private key:', error);
      alert('Could not reveal private key');
    } finally {
      setIsRevealing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertDescription>User not found</AlertDescription>
      </Alert>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/user/login');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-gray-600 pt-2">Welcome to your profile {user.username}</p>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 mb-5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Username</label>
              <p className="text-lg font-medium">{user.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
              <p className="text-sm font-mono bg-secondary/50 p-2 rounded-md overflow-x-auto">
                {user.address || 'Not connected'}
              </p>
            </div>
            {user.smartAccountAddress && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Smart Account</label>
                <p className="text-sm font-mono bg-secondary/50 p-2 rounded-md overflow-x-auto">
                  {user.smartAccountAddress}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Private Key Recovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter PIN to reveal key"
                value={pinForKey}
                onChange={(e: any) => setPinForKey(e.target.value)}
              />
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleRevealKey}
                disabled={isRevealing}
              >
                {isRevealing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Key className="w-4 h-4 mr-2" />
                )}
                Reveal Private Key
              </Button>
            </div>
            {revealedKey && (
              <Alert>
                <AlertDescription>
                  {revealedKey}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Claimed Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.claims && user.claims.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {user.claims.map((claim, idx) => (
                <div
                  key={idx}
                  className="bg-secondary/50 rounded-lg p-4 space-y-2"
                >
                  <h3 className="font-medium">{claim.product.name}</h3>
                  {claim.tokenId && (
                    <p className="text-sm text-muted-foreground">
                      Token ID: {claim.tokenId}
                    </p>
                  )}
                  {claim.claimedNFTUrl && (
                    <a
                      href={claim.claimedNFTUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      View Certificate
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {claim.product.ipfsUrl && (
                    <a
                      href={claim.product.ipfsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      View on IPFS
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {user.transactions && (
                    <a
                      href={`https://sepolia.basescan.org/tx/${user.transactions[idx].txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      View Transaction on Etherscan
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {claim.product.ipfsUrl && (
                    <a
                      href={`https://testnets.opensea.io/assets/base_sepolia/${claim.product.contractAddress}/${claim.tokenId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
                      View on OpenSea
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {claim.claimedAt && (
                    <p className="text-xs text-muted-foreground">
                      Claimed: {new Date(claim.claimedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No products claimed yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;