/* eslint-disable @typescript-eslint/no-explicit-any */
// DashboardPage.tsx
import { LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../libs/utils';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [prodCount, setProdCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  useEffect(() => {
    checkAuth();
  })

  const checkAuth = async () => {
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

        setProdCount(await productCount());
        setAdminCount(await fetchAdmins());
      } catch (error) {
        handleLogout();
        console.error('Error decoding token:', error);
      }
    };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Add dashboard-specific stats and overview here
  const productCount = async () => {
    try {
      const response = await api.get('/products/');
      console.log('Product Response: ', response.data.length);
      return response.data.length;
    } catch (error) {
      console.error('Error fetching product count:', error);
      return 0;
    }
  }

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/all');
      console.log('Admins: ', res.data.length);
      return res.data.length;
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2 mb-5"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{prodCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{adminCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;