/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';

// interface QR {
//   _id: string;
//   code: string;
//   claimed: boolean;
//   claimedBy: string;
//   mintedTokenId: string;
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
//   qrCodes: QR[];
// }

// interface ProductListProps {
//   products: Product[];
//   onDelete?: (id: string) => void;
//   onDeployContract?: (id: string) => void; // new callback
// }

// const ProductList: React.FC<ProductListProps> = ({ products, onDelete, onDeployContract, onGenerateQR }) => {
//   return (
//     <div className="max-w-3xl mx-auto mt-4">
//       <h2 className="text-xl font-bold mb-4">Products</h2>
//       {products.length === 0 ? (
//         <p>No products yet.</p>
//       ) : (
//         <table className="min-w-full border border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Type</th>
//               <th className="border p-2">Location</th>
//               <th className="border p-2">Creator</th>
//               <th className="border p-2">Date of Creation</th>
//               <th className="border p-2">Expiry Date</th>
//               <th className="border p-2">Latitude</th>
//               <th className="border p-2">Longitude</th>
//               <th className="border p-2">IPFS URL</th>
//               <th className="border p-2">Contract Address</th>
//               {onDelete && <th className="border p-2">Actions</th>}
//               <th className="border p-2">QR Codes</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product._id}>
//                 <td className="border p-2">{product.name}</td>
//                 <td className="border p-2">{product.type}</td>
//                 <td className="border p-2">{product.location}</td>
//                 <td className="border p-2">{product.creator}</td>
//                 <td className="border p-2">
//                   {new Date(product.dateOfCreation).toLocaleDateString()}
//                 </td>
//                 <td className="border p-2">
//                   {product.expiryDate
//                     ? new Date(product.expiryDate).toLocaleDateString()
//                     : '-'}
//                 </td>
//                 <td className="border p-2">{product.latitude}</td>
//                 <td className="border p-2">{product.longitude}</td>
//                 <td className="border p-2">{product.ipfsUrl}</td>
//                 <td className="border p-2">
//                   {product.contractAddress ? (
//                     <span className="text-green-600 font-semibold">
//                       {product.contractAddress}
//                     </span>
//                   ) : (
//                     <span className="text-gray-400">Not Deployed</span>
//                   )}
//                 </td>
//                 <td className="border p-2 space-x-2">
//                   {onDelete && (
//                     <button
//                       onClick={() => onDelete(product._id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Delete
//                     </button>
//                   )}
//                   {onDeployContract && !product.contractAddress && (
//                     <button
//                       onClick={() => onDeployContract(product._id)}
//                       className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
//                     >
//                       Deploy Contract
//                     </button>
//                   )}
//                   <button
//                     onClick={() => onGenerateQR(product._id)}
//                     className="text-green-500 hover:text-green-700 ml-2"
//                   >
//                     Generate QRs
//                   </button>
//                 </td>
//                 <td className="border p-2 space-y-2">
//                   {product.qrCodes && product.qrCodes.length > 0 ? (
//                     product.qrCodes.map((qr) => (
//                       <div key={qr.code}>
//                         <a
//                           href={`http://kashmir-traceability-backend.vercel.app/api/products/qr-image/${qr.code}`}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-blue-500 underline"
//                         >
//                           View QR
//                         </a>
//                         {" "}({qr.claimed ? 'Claimed' : 'Unclaimed'})
//                       </div>
//                     ))
//                   ) : (
//                     <span>No QRs</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// 3 Jan

// import React, { useState } from 'react';
// import { 
//   Trash2, 
//   Rocket, 
//   QrCode, 
//   ExternalLink, 
//   Search,
//   ChevronUp,
//   ChevronDown,
//   Loader2,
//   MapPin
// } from 'lucide-react';
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../components/ui/tooltip";
// import { Badge } from "../components/ui/badge";

// interface QR {
//   _id: string;
//   code: string;
//   claimed: boolean;
//   claimedBy: string;
//   mintedTokenId: string;
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
//   qrCodes: QR[];
// }

// interface ProductListProps {
//   products: Product[];
//   onDelete?: (id: string) => void;
//   onDeployContract?: (id: string) => void;
//   onGenerateQR?: (id: string) => void;
//   isLoading?: boolean;
// }

// const ProductList: React.FC<ProductListProps> = ({ 
//   products, 
//   onDelete, 
//   onDeployContract, 
//   onGenerateQR,
//   isLoading 
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortField, setSortField] = useState<keyof Product>('name');
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     product.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     const aValue = a[sortField]?.toString() || '';
//     const bValue = b[sortField]?.toString() || '';
//     return sortDirection === 'asc' 
//       ? aValue.localeCompare(bValue)
//       : bValue.localeCompare(aValue);
//   });

//   const handleSort = (field: keyof Product) => {
//     setSortField(field);
//     setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
//   };

//   const SortIcon = ({ field }: { field: keyof Product }) => (
//     <span className="inline-flex ml-2">
//       {sortField === field ? (
//         sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
//       ) : null}
//     </span>
//   );

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
//           <Input
//             placeholder="Search products..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
//         </div>
//       ) : products.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//           No products available.
//         </div>
//       ) : (
//         <div className="border rounded-lg overflow-hidden">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead 
//                   className="cursor-pointer"
//                   onClick={() => handleSort('name')}
//                 >
//                   Name <SortIcon field="name" />
//                 </TableHead>
//                 <TableHead 
//                   className="cursor-pointer"
//                   onClick={() => handleSort('type')}
//                 >
//                   Type <SortIcon field="type" />
//                 </TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Creator</TableHead>
//                 <TableHead>Dates</TableHead>
//                 <TableHead>Contract Status</TableHead>
//                 <TableHead>QR Codes</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {sortedProducts.map((product) => (
//                 <TableRow key={product._id}>
//                   <TableCell className="font-medium">{product.name}</TableCell>
//                   <TableCell>
//                     <Badge variant="secondary">
//                       {product.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger className="flex items-center gap-1">
//                           <MapPin className="h-4 w-4" />
//                           {product.location}
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Lat: {product.latitude}</p>
//                           <p>Long: {product.longitude}</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </TableCell>
//                   <TableCell>{product.creator}</TableCell>
//                   <TableCell>
//                     <div className="space-y-1">
//                       <div className="text-sm">
//                         Created: {new Date(product.dateOfCreation).toLocaleDateString()}
//                       </div>
//                       {product.expiryDate && (
//                         <div className="text-sm text-gray-500">
//                           Expires: {new Date(product.expiryDate).toLocaleDateString()}
//                         </div>
//                       )}
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     {product.contractAddress ? (
//                       <Badge variant="success" className="gap-1">
//                         <ExternalLink className="h-3 w-3" />
//                         Deployed
//                       </Badge>
//                     ) : (
//                       <Badge variant="secondary">Not Deployed</Badge>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {product.qrCodes && product.qrCodes.length > 0 ? (
//                       <div className="space-y-1">
//                         {product.qrCodes.map((qr) => (
//                           <div key={qr.code} className="flex items-center gap-2">
//                             <Badge
//                               variant={qr.claimed ? "default" : "outline"}
//                               className="text-xs"
//                             >
//                               {qr.claimed ? 'Claimed' : 'Unclaimed'}
//                             </Badge>
//                             <a
//                               href={`http://kashmir-traceability-backend.vercel.app/api/products/qr-image/${qr.code}`}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="text-blue-500 hover:text-blue-700"
//                             >
//                               <ExternalLink className="h-3 w-3" />
//                             </a>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <span className="text-gray-500 text-sm">No QR codes</span>
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       {onDelete && (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => onDelete(product._id)}
//                           className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       )}
//                       {onDeployContract && !product.contractAddress && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onDeployContract(product._id)}
//                           className="gap-1"
//                         >
//                           <Rocket className="h-4 w-4" />
//                           Deploy
//                         </Button>
//                       )}
//                       {onGenerateQR && (
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => onGenerateQR(product._id)}
//                           className="gap-1"
//                         >
//                           <QrCode className="h-4 w-4" />
//                           Generate
//                         </Button>
//                       )}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// 3 Jan 2nd iteration

import React, { useEffect, useState } from 'react';
import { 
  Trash2, 
  Rocket, 
  QrCode, 
  ExternalLink, 
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
  MapPin,
  User,
} from 'lucide-react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Progress } from "../components/ui/progress";
import { useNavigate } from 'react-router-dom';

interface QR {
  _id: string;
  code: string;
  claimed: boolean;
  claimedBy: string;
  mintedTokenId: string;
}

interface Product {
  _id: string;
  name: string;
  type: string;
  location: string;
  creator: string;
  dateOfCreation: string;
  expiryDate?: string;
  latitude: string;
  longitude: string;
  ipfsUrl: string;
  contractAddress?: string;
  qrCodes: QR[];
}

interface ProductListProps {
  products: Product[];
  onDelete?: (id: string) => void;
  onDeployContract?: (id: string) => void;
  onGenerateQR?: (id: string) => void;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  onDelete, 
  onDeployContract, 
  onGenerateQR,
  isLoading 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField]?.toString() || '';
    const bValue = b[sortField]?.toString() || '';
    return sortDirection === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentAdmin(payload);
      
      console.log('currentAdmin', currentAdmin);
      console.log('Payload', payload);
      // Check token expiration
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } catch (error) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
      console.error('Error decoding token:', error);
    }
  };

  const handleSort = (field: keyof Product) => {
    setSortField(field);
    setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
  };

  const SortIcon = ({ field }: { field: keyof Product }) => (
    <span className="inline-flex ml-2">
      {sortField === field ? (
        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
      ) : null}
    </span>
  );

  const QRCodeModal = ({ product }: { product: Product }) => {
    const totalQRs = product.qrCodes.length;
    const claimedQRs = product.qrCodes.filter(qr => qr.claimed).length;
    const claimPercentage = (claimedQRs / totalQRs) * 100;

    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span>QR Codes for {product.name}</span>
            <Badge variant="outline">
              {totalQRs} Total QR Codes
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Claim Progress</span>
              <span>{claimedQRs} of {totalQRs} Claimed ({claimPercentage.toFixed(1)}%)</span>
            </div>
            <Progress value={claimPercentage} />
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-4 p-4">
              {product.qrCodes.map((qr) => (
                <div
                  key={qr.code}
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">
                        Token ID: {qr.mintedTokenId || 'Not minted'}
                      </div>
                      {qr.claimed && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Claimed by: {qr.claimedBy}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={qr.claimed ? "default" : "outline"}
                    >
                      {qr.claimed ? 'Claimed' : 'Unclaimed'}
                    </Badge>
                    <a
                      href={`http://kashmir-traceability-backend.vercel.app/api/products/qr-image/${qr.code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products available.
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name <SortIcon field="name" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('type')}
                >
                  Type <SortIcon field="type" />
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Contract Status</TableHead>
                <TableHead>QR Codes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {product.location}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lat: {product.latitude}</p>
                          <p>Long: {product.longitude}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{product.creator}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        Created: {new Date(product.dateOfCreation).toLocaleDateString()}
                      </div>
                      {product.expiryDate && (
                        <div className="text-sm text-gray-500">
                          Expires: {new Date(product.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.contractAddress ? (
                      <Badge variant="success" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Deployed
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not Deployed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.qrCodes && product.qrCodes.length > 0 ? (
                      <Dialog>
                        <DialogTrigger>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                          >
                            <QrCode className="h-4 w-4" />
                            View QRs ({product.qrCodes.filter(qr => qr.claimed).length}/{product.qrCodes.length})
                          </Button>
                        </DialogTrigger>
                        <QRCodeModal product={product} />
                      </Dialog>
                    ) : (
                      <span className="text-gray-500 text-sm">No QR codes</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product._id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {onDeployContract && !product.contractAddress && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDeployContract(product._id)}
                          className="gap-1"
                        >
                          <Rocket className="h-4 w-4" />
                          Deploy
                        </Button>
                      )}
                      {onGenerateQR && !product.qrCodes?.length && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGenerateQR(product._id)}
                          className="gap-1"
                        >
                          <QrCode className="h-4 w-4" />
                          Generate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProductList;