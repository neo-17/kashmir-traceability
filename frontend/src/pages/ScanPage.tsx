/* eslint-disable @typescript-eslint/no-explicit-any */
// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import MintNFTButton from '../components/MintNFTButton';

// // interface QRCodeData {
// //   code: string;
// //   claimed: boolean;
// //   claimedBy: string | null;
// //   mintedTokenId: number | null;
// // }

// // interface Product {
// //   _id: string;
// //   name: string;
// //   type: string;
// //   location: string;
// //   creator: string;
// //   dateOfCreation: string;
// //   expiryDate?: string;
// //   latitude: string;
// //   longitude: string;
// //   ipfsUrl: string;
// //   contractAddress?: string;
// //   qrCodes: QRCodeData[];
// // }

// // // This interface will match whatever the backend returns when we create a user
// // interface UserResponse {
// //   _id: string;            // The User document ID in Mongo
// //   username: string;       // The username we stored
// //   address: string;        // EOA or SC address (depending on your approach)
// //   smartAccountAddress?: string; // If using Biconomy smart account
// //   // ... any other fields you return
// // }

// // const ScanPage: React.FC = () => {
// //   const { code } = useParams();
// //   const [product, setProduct] = useState<Product | null>(null);
// //   const [qr, setQr] = useState<QRCodeData | null>(null);
// //   const [loading, setLoading] = useState(true);

// //   // Fields for user creation
// //   const [username, setUsername] = useState('');
// //   const [pin, setPin] = useState('');

// //   // The user data we get from the backend
// //   const [user, setUser] = useState<UserResponse | null>(null);

// //   useEffect(() => {
// //     if (code) {
// //       fetchProductByCode(code);
// //     }
// //   }, [code]);

// //   const fetchProductByCode = async (qrCode: string) => {
// //     try {
// //       const res = await axios.get(`http://kashmir-traceability-backend.vercel.app/api/products/qr/${qrCode}`);
// //       setProduct(res.data.product);
// //       setQr(res.data.qrCode);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error('Error fetching product by QR code:', error);
// //       setLoading(false);
// //     }
// //   };

// //   /**
// //    * Register user in the backend:
// //    *   - We send username + PIN
// //    *   - The backend derives the private key or creates a Biconomy Smart Account,
// //    *     then stores only non-sensitive info (address, user record).
// //    *   - The backend returns a user object with an address (EOA or SC).
// //    */
// //   const handleRegisterOrLoginUser = async () => {
// //     if (!username || !pin) {
// //       alert('Please enter username and PIN.');
// //       return;
// //     }
// //     try {
// //       const res = await axios.post('http://kashmir-traceability-backend.vercel.app/api/users/register', {
// //         username,
// //         pin,
// //       });
// //       // The response should contain the user document, including the address or SC address.
// //       setUser(res.data.user);
// //       alert(`User created/fetched successfully. Address: ${res.data.user.smartAccountAddress}`);
// //     } catch (error) {
// //       console.error('Error registering user:', error);
// //       alert('Error registering user.');
// //     }
// //   };

// //   if (loading) return <div>Loading...</div>;
// //   if (!product || !qr) return <div>Invalid or expired QR code.</div>;

// //   return (
// //     <div className="p-4">
// //       <h1 className="text-2xl font-bold mb-2">Product: {product.name}</h1>
// //       <p>Location: {product.location}</p>
// //       <p>Creator: {product.creator}</p>
// //       {product.contractAddress ? (
// //         <p>Contract Address: {product.contractAddress}</p>
// //       ) : (
// //         <p>No contract deployed yet.</p>
// //       )}

// //       <div className="mt-4">
// //         <h2 className="font-bold">QR Status: {qr.claimed ? 'Claimed' : 'Unclaimed'}</h2>
// //         {qr.claimedBy && <p>Claimed By: {qr.claimedBy}</p>}
// //       </div>

// //       {qr.claimed ? (
// //         <div className="text-red-500 mt-4">This QR code has already been claimed.</div>
// //       ) : (
// //         <div className="mt-4 border p-4">
// //           <h3 className="font-bold mb-2">Register / Login</h3>
// //           <input
// //             className="border p-2 mb-2 w-full"
// //             placeholder="Username"
// //             value={username}
// //             onChange={(e) => setUsername(e.target.value)}
// //           />
// //           <input
// //             className="border p-2 mb-2 w-full"
// //             placeholder="6 Digit PIN"
// //             type="password"
// //             maxLength={6}
// //             value={pin}
// //             onChange={(e) => setPin(e.target.value)}
// //           />
// //           <button
// //             className="bg-blue-500 text-white px-4 py-2"
// //             onClick={handleRegisterOrLoginUser}
// //           >
// //             Register / Login
// //           </button>

// //           {user && (
// //             <div className="mt-4">
// //               <p>Logged in as: {user.username}</p>
// //               {user.smartAccountAddress && (
// //                 <p>Your Smart Account Address: {user.smartAccountAddress}</p>
// //               )}
// //               <MintNFTButton productId={product._id} userAddress={user.smartAccountAddress as string} code={qr.code} />
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ScanPage;

// // 3 Jan

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
// import { Input } from "../components/ui/input"
// import { Button } from "../components/ui/button"
// import { Badge } from "../components/ui/badge"
// import { Alert, AlertDescription } from "../components/ui/alert"
// import { Loader2, CheckCircle2, XCircle, MapPin, User, Key } from 'lucide-react'
// import MintNFTButton from '../components/MintNFTButton';

// interface QRCodeData {
//   code: string;
//   claimed: boolean;
//   claimedBy: string | null;
//   mintedTokenId: number | null;
// }

// interface Product {
//   _id: string;
//   name: string;
//   type: string;
//   location: string;
//   creator: string;
//   dateOfCreation: string;
//   expiryDate?: string;
//   latitude: string;
//   longitude: string;
//   ipfsUrl: string;
//   contractAddress?: string;
//   qrCodes: QRCodeData[];
// }

// interface UserResponse {
//   _id: string;
//   username: string;
//   address: string;
//   smartAccountAddress?: string;
// }

// const ScanPage: React.FC = () => {
//   const { code } = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [qr, setQr] = useState<QRCodeData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [username, setUsername] = useState('');
//   const [pin, setPin] = useState('');
//   const [user, setUser] = useState<UserResponse | null>(null);

//   useEffect(() => {
//     if (code) {
//       fetchProductByCode(code);
//     }
//   }, [code]);

//   const fetchProductByCode = async (qrCode: string) => {
//     try {
//       const res = await axios.get(`http://kashmir-traceability-backend.vercel.app/api/products/qr/${qrCode}`);
//       setProduct(res.data.product);
//       setQr(res.data.qrCode);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching product by QR code:', error);
//       setLoading(false);
//     }
//   };

//   const handleRegisterOrLoginUser = async () => {
//     if (!username || !pin) {
//       alert('Please enter username and PIN.');
//       return;
//     }
//     try {
//       const res = await axios.post('http://kashmir-traceability-backend.vercel.app/api/users/register', {
//         username,
//         pin,
//       });
//       setUser(res.data.user);
//       alert(`User created/fetched successfully. Address: ${res.data.user.smartAccountAddress}`);
//     } catch (error) {
//       console.error('Error registering user:', error);
//       alert('Error registering user.');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   if (!product || !qr) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Alert>
//           <XCircle className="h-4 w-4" />
//           <AlertDescription>Invalid or expired QR code.</AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <Card className="max-w-2xl mx-auto">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
//             <Badge variant={qr.claimed ? "secondary" : "success"}>
//               {qr.claimed ? 'Claimed' : 'Available'}
//             </Badge>
//           </div>
//           <CardDescription>Verify product authenticity and ownership</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-2">
//                 <MapPin className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm">{product.location}</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <User className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm">{product.creator}</span>
//               </div>
//             </div>

//             {product.contractAddress && (
//               <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
//                 <Key className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-mono">{product.contractAddress}</span>
//               </div>
//             )}

//             {qr.claimed ? (
//               <Alert>
//                 <CheckCircle2 className="h-4 w-4" />
//                 <AlertDescription>
//                   This QR code has been claimed by {qr.claimedBy}
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Register / Login</CardTitle>
//                   <CardDescription>Create an account or sign in to claim this product</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <Input
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                   />
//                   <Input
//                     placeholder="6 Digit PIN"
//                     type="password"
//                     maxLength={6}
//                     value={pin}
//                     onChange={(e) => setPin(e.target.value)}
//                   />
//                   <Button 
//                     className="w-full"
//                     onClick={handleRegisterOrLoginUser}
//                   >
//                     Register / Login
//                   </Button>

//                   {user && (
//                     <div className="mt-4 space-y-4">
//                       <Alert>
//                         <CheckCircle2 className="h-4 w-4" />
//                         <AlertDescription>
//                           Logged in as {user.username}
//                         </AlertDescription>
//                       </Alert>
                      
//                       {user.smartAccountAddress && (
//                         <div className="bg-gray-50 p-3 rounded-lg">
//                           <p className="text-sm text-gray-600">Smart Account Address:</p>
//                           <p className="text-sm font-mono">{user.smartAccountAddress}</p>
//                         </div>
//                       )}
                      
//                       <MintNFTButton 
//                         productId={product._id} 
//                         userAddress={user.smartAccountAddress as string} 
//                         code={qr.code} 
//                       />
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ScanPage;

// 04 Jan
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
// import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, MapPin, ArrowRight, Gift } from 'lucide-react';
import MintNFTButton from '../components/MintNFTButton';
import ProgressBar from '../components/ProgressBar';
import AnimatedBackground from '../components/AnimatedBackground';

const screens = {
  LOGIN: 'login',
  HERITAGE: 'heritage',
  MANUFACTURING: 'manufacturing',
  VIDEO: 'video',
  LOCATION: 'location',
  MINT: 'mint',
  SUCCESS: 'success'
};

const ScanPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(screens.LOGIN);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (code) {
      fetchProductByCode(code);
    }
  }, [code]);

  const fetchProductByCode = async (qrCode: any) => {
    try {
      const res = await axios.get(`http://kashmir-traceability-backend.vercel.app/api/products/qr/${qrCode}`);
      console.log('Response:', res.data);
      setProduct(res.data.product);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleRegisterOrLoginUser = async () => {
    if (!username || !pin) {
      alert('Please enter username and PIN.');
      return;
    }
    try {
      const res = await axios.post('http://kashmir-traceability-backend.vercel.app/api/users/register', {
        username,
        pin,
      });

      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('userToken', res.data.token);
      setCurrentScreen(screens.HERITAGE);
    } catch (error) {
      alert('Error registering user.');
      console.error('Error registering user:', error);
    }
  };

  const handleNext = () => {
    const screenOrder = Object.values(screens);
    const currentIndex = screenOrder.indexOf(currentScreen);
    if (currentIndex < screenOrder.length - 1) {
      setCurrentScreen(screenOrder[currentIndex + 1]);
    } else {
      navigate(`/profile/${username}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const renderScreen = () => {
    const slideVariants = {
      enter: { x: 1000, opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: -1000, opacity: 0 }
    };

    switch (currentScreen) {
      case screens.LOGIN:
        return (
          <motion.div
            key="login"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-md"
          >
            <Card className="bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome to Kashmir Valley</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e: any) => setUsername(e.target.value)}
                />
                <Input
                  placeholder="6 Digit PIN"
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e: any) => setPin(e.target.value)}
                />
                <Button 
                  className="w-full"
                  onClick={handleRegisterOrLoginUser}
                >
                  Begin Your Journey
                </Button>
              </CardContent>
              {error && <p className="text-red-500">{error}</p>}
            </Card>
          </motion.div>
        );

      case screens.HERITAGE:
        return (
          <motion.div
            key="heritage"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>The Heritage of Kashmir</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img
                  src="/api/placeholder/600/300"
                  alt="Kashmir Valley"
                  className="rounded-lg w-full"
                />
                <p className="text-lg">
                  Nestled in the heart of the Himalayas, Kashmir's heritage is as rich as its soil.
                  For centuries, our valley has been known for producing the world's finest saffron,
                  locally known as "Kesar".
                </p>
                <Button onClick={handleNext} className="w-full">
                  Continue the Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

      case screens.MANUFACTURING:
        return (
          <motion.div
            key="manufacturing"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Traditional Craftsmanship</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src="/api/placeholder/280/200"
                    alt="Manufacturing Process 1"
                    className="rounded-lg"
                  />
                  <img
                    src="/api/placeholder/280/200"
                    alt="Manufacturing Process 2"
                    className="rounded-lg"
                  />
                </div>
                <p className="text-lg">
                  Our artisans carefully harvest and process each strand of saffron using
                  traditional methods passed down through generations.
                </p>
                <Button onClick={handleNext} className="w-full">
                  See More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

      case screens.VIDEO:
        return (
          <motion.div
            key="video"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>The Art of Saffron</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Video Placeholder</p>
                </div>
                <Button onClick={handleNext} className="w-full">
                  Discover Origin <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

      case screens.LOCATION:
        return (
          <motion.div
            key="location"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Origin Story</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg relative">
                  <MapPin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 h-8 w-8" />
                </div>
                <p className="text-lg flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {product?.location || 'Kashmir Valley'}
                </p>
                <Button onClick={handleNext} className="w-full">
                  Claim Your NFT <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );

        case screens.MINT:
          return (
            <motion.div
              key="mint"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-2xl"
            >
              <Card className="bg-white/90 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Make It Yours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">
                    Own a piece of Kashmir's heritage. Mint your unique NFT to verify
                    the authenticity of your product.
                  </p>
                  <MintNFTButton
                    productId={product?._id}
                    userAddress={user?.smartAccountAddress}
                    code={code}
                    onSuccess={() => {
                      // This will be called 2 seconds after successful minting
                      setCurrentScreen(screens.SUCCESS);
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          );

      case screens.SUCCESS:
        return (
          <motion.div
            key="success"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <Card className="bg-white/90 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-center">Congratulations! 🎉</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <Gift className="h-16 w-16 mx-auto text-green-500" />
                <p className="text-xl">
                  You are now a proud owner of authentic Kashmir Valley saffron!
                </p>
                <Button onClick={() => navigate(`/profile/${user?.username}`)} className="w-full">
                  View Your Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center">
      <ProgressBar currentScreen={currentScreen} screens={screens} />
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
};

export default ScanPage;