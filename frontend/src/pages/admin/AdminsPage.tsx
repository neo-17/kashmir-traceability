// AdminsPage.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../libs/utils';

interface Admin {
  _id: string;
  username: string;
  email: string;
}

const AdminsPage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    username: '',
    pin: ''
  });
  
  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentAdmin && admins.length === 0) {
      fetchAdmins();
    }
  }, [currentAdmin, admins]);

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
        _id: payload.id,
        username: payload.username,
        email: payload.email
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

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/all');
      console.log('Admins: ', res.data);
      setAdmins(res.data);
      
      // Find current admin from the token
      const token = localStorage.getItem('adminToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentAdmin(res.data.find((admin: Admin) => admin._id === payload.id));
      }
    } catch (error) {
      setError('Failed to fetch admins list');
      console.error('Error fetching admins:', error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/add', newAdmin);
      setNewAdmin({ email: '', username: '', pin: '' });
      await fetchAdmins();
    } catch (error) {
      setError('Failed to add admin');
      console.error('Error adding admin:', error);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (admins.length === 1) {
      setError('Cannot remove the last admin');
      return;
    }
    
    if (currentAdmin?._id === adminId) {
      setError('You cannot remove yourself');
      return;
    }

    try {
      await api.delete(`/admin/remove/${adminId}`);
      await fetchAdmins();
    } catch (error) {
      setError('Failed to remove admin');
      console.error('Error removing admin:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Administrators</h1>
      
      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Administrator</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pin">PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  value={newAdmin.pin}
                  onChange={(e) => setNewAdmin({ ...newAdmin, pin: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Admin</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <div key={admin._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{admin.username}</p>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                  {admins.length > 1 && admin._id !== currentAdmin?._id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAdmin(admin._id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminsPage;