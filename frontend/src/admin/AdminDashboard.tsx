// import React, { useEffect, useState } from 'react';
// import { Plus, RefreshCw, AlertCircle, Users, LogOut } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ProductForm from './ProductForm';
// import ProductList from './ProductList';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { Alert, AlertDescription } from '../components/ui/alert';
// import { Button } from '../components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";

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

// interface Admin {
//   _id: string;
//   username: string;
//   email: string;
// }

// const AdminDashboard: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [admins, setAdmins] = useState<Admin[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [showAdminDialog, setShowAdminDialog] = useState(false);
//   const navigate = useNavigate();
//   const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

//   // New admin form state
//   const [newAdmin, setNewAdmin] = useState({
//     email: '',
//     username: '',
//     pin: ''
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     // Set up axios interceptor for authentication
//     axios.interceptors.request.use(
//       config => {
//         config.headers.Authorization = `Bearer ${token}`;
//         return config;
//       },
//       error => {
//         return Promise.reject(error);
//       }
//     );

//     fetchInitialData();
//   }, [navigate]);

//   const fetchInitialData = async () => {
//     try {
//       await Promise.all([fetchProducts(), fetchAdmins()]);
//     } catch (error) {
//       console.error('Error fetching initial data:', error);
//     }
//   };

//   const fetchAdmins = async () => {
//     try {
//       const res = await axios.get('http://kashmir-traceability-backend.vercel.app/api/admin/all');
//       setAdmins(res.data);
      
//       // Find current admin from the token
//       const token = localStorage.getItem('adminToken');
//       if (token) {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         setCurrentAdmin(res.data.find((admin: Admin) => admin._id === payload.id));
//       }
//     } catch (error) {
//       setError('Failed to fetch admins list');
//       console.error('Error fetching admins:', error);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     navigate('/login');
//   };

//   const handleAddAdmin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://kashmir-traceability-backend.vercel.app/api/admin/add', newAdmin);
//       setNewAdmin({ email: '', username: '', pin: '' });
//       setShowAdminDialog(false);
//       await fetchAdmins();
//     } catch (error) {
//       setError('Failed to add admin');
//       console.error('Error adding admin:', error);
//     }
//   };

//   const handleRemoveAdmin = async (adminId: string) => {
//     if (admins.length === 1) {
//       setError('Cannot remove the last admin');
//       return;
//     }
    
//     if (currentAdmin?._id === adminId) {
//       setError('You cannot remove yourself');
//       return;
//     }

//     try {
//       await axios.delete(`http://kashmir-traceability-backend.vercel.app/api/admin/remove/${adminId}`);
//       await fetchAdmins();
//     } catch (error) {
//       setError('Failed to remove admin');
//       console.error('Error removing admin:', error);
//     }
//   };

//   // Existing product-related functions remain the same
//   const fetchProducts = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const res = await axios.get('http://kashmir-traceability-backend.vercel.app/api/products');
//       setProducts(res.data);
//     } catch (error) {
//       setError('Failed to fetch products. Please try again later.');
//       console.error('Error fetching products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const createProduct = async (productData: Omit<Product, '_id'>) => {
//     try {
//       setError(null);
//       const res = await axios.post('http://kashmir-traceability-backend.vercel.app/api/products', productData);
//       setProducts((prev) => [...prev, res.data]);
//       setShowForm(false); // Hide form after successful creation
//     } catch (error) {
//       setError('Failed to create product. Please try again.');
//       console.error('Error creating product:', error);
//     }
//   };

//   const deleteProduct = async (id: string) => {
//     try {
//       setError(null);
//       await axios.delete(`http://kashmir-traceability-backend.vercel.app/api/products/${id}`);
//       setProducts((prev) => prev.filter((p) => p._id !== id));
//     } catch (error) {
//       setError('Failed to delete product. Please try again.');
//       console.error('Error deleting product:', error);
//     }
//   };

//   const deployContract = async (id: string) => {
//     try {
//       setError(null);
//       const res = await axios.post(`http://kashmir-traceability-backend.vercel.app/api/products/${id}/deployContract`);
//       setProducts((prev) =>
//         prev.map((p) =>
//           p._id === id ? { ...p, contractAddress: res.data.contractAddress } : p
//         )
//       );
//     } catch (error) {
//       setError('Contract deployment failed. Please try again.');
//       console.error('Error deploying contract:', error);
//     }
//   };

//   const generateQRs = async (productId: string) => {
//     try {
//       setError(null);
//       const res = await axios.post(
//         `http://kashmir-traceability-backend.vercel.app/api/products/${productId}/generate-qr`
//       );
//       await fetchProducts();
//       return res.data.message;
//     } catch (error) {
//       setError('Failed to generate QR codes. Please try again.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Manage your products, contracts, and QR codes
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <Button
//               variant="outline"
//               onClick={() => setShowAdminDialog(true)}
//               className="flex items-center gap-2"
//             >
//               <Users className="h-4 w-4" />
//               Manage Admins
//             </Button>
//             <Button
//               onClick={() => setShowForm(!showForm)}
//               className="flex items-center gap-2"
//             >
//               <Plus className="h-4 w-4" />
//               {showForm ? 'Cancel' : 'Add Product'}
//             </Button>
//             <Button
//               variant="outline"
//               onClick={fetchProducts}
//               className="flex items-center gap-2"
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleLogout}
//               className="flex items-center gap-2"
//             >
//               <LogOut className="h-4 w-4" />
//               Logout
//             </Button>
//           </div>
//         </div>

//         {error && (
//           <Alert>
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {/* Admin Management Dialog */}
//         <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Manage Administrators</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <form onSubmit={handleAddAdmin} className="space-y-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={newAdmin.email}
//                     onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     value={newAdmin.username}
//                     onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="pin">PIN</Label>
//                   <Input
//                     id="pin"
//                     type="password"
//                     value={newAdmin.pin}
//                     onChange={(e) => setNewAdmin({ ...newAdmin, pin: e.target.value })}
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full">Add Admin</Button>
//               </form>

//               <div className="mt-6">
//                 <h3 className="text-lg font-medium mb-4">Current Administrators</h3>
//                 <div className="space-y-2">
//                   {admins.map((admin) => (
//                     <div key={admin._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                       <div>
//                         <p className="font-medium">{admin.username}</p>
//                         <p className="text-sm text-gray-500">{admin.email}</p>
//                       </div>
//                       {admins.length > 1 && admin._id !== currentAdmin?._id && (
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleRemoveAdmin(admin._id)}
//                         >
//                           Remove
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Existing product management UI remains the same */}
//         {showForm && (
//           <Card className="mb-8">
//             <CardHeader>
//               <CardTitle>Create New Product</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ProductForm onCreate={createProduct} />
//             </CardContent>
//           </Card>
//         )}

//         <Card>
//           <CardHeader>
//             <CardTitle>Products</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ProductList
//               products={products}
//               onDelete={deleteProduct}
//               onDeployContract={deployContract}
//               onGenerateQR={generateQRs}
//               isLoading={isLoading}
//             />
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
