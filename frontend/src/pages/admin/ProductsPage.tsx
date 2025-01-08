import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, AlertCircle, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import ProductForm from '../../admin/ProductForm';
import ProductList from '../../admin/ProductList';
import { api } from '../../libs/utils';

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

interface QR {
  _id: string;
  code: string;
  claimed: boolean;
  claimedBy: string;
  mintedTokenId: string;
}

interface Admin {
  id: string;
  username: string;
  role: string;
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentAdmin) {
      fetchProducts();
    }
  }, [currentAdmin]);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check token expiration
      if (payload.exp * 1000 < Date.now()) {
        handleLogout();
        return;
      }

      setCurrentAdmin({
        id: payload.id,
        username: payload.username,
        role: payload.role
      });

      // Set up axios interceptor for authenticated requests
      api.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });

      // Handle unauthorized responses
      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            handleLogout();
          }
          return Promise.reject(error);
        }
      );
    } catch (error) {
      handleLogout();
      console.error('Error decoding token:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, '_id'>) => {
    try {
      setError(null);
      const res = await api.post('/products', productData);
      setProducts((prev) => [...prev, res.data]);
      setShowForm(false);
    } catch (error) {
      setError('Failed to create product. Please try again.');
      console.error('Error creating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      setError('Failed to delete product. Please try again.');
      console.error('Error deleting product:', error);
    }
  };

  const deployContract = async (id: string) => {
    try {
      setError(null);
      const res = await api.post(`/products/${id}/deployContract`);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, contractAddress: res.data.contractAddress } : p
        )
      );
    } catch (error) {
      setError('Contract deployment failed. Please try again.');
      console.error('Error deploying contract:', error);
    }
  };

  const generateQRs = async (productId: string) => {
    try {
      setError(null);
      await api.post(`/products/${productId}/generate-qr`);
      await fetchProducts();
    } catch (error) {
      setError('Failed to generate QR codes. Please try again.');
      console.error(error);
    }
  };

  if (!currentAdmin) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            Logged in as: {currentAdmin.username}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showForm ? 'Cancel' : 'Add Product'}
          </Button>
          <Button
            variant="outline"
            onClick={fetchProducts}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm onCreate={createProduct} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList
            products={products}
            onDelete={deleteProduct}
            onDeployContract={deployContract}
            onGenerateQR={generateQRs}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;