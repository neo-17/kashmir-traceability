/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { MapPin, User, Box, Calendar, Flag, Navigation } from 'lucide-react';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useNavigate } from 'react-router-dom';

interface ProductFormProps {
  onCreate: (productData: ProductData) => void;
}

interface QR {
  _id: string;
  code: string;
  claimed: boolean;
  claimedBy: string;
  mintedTokenId: string;
}

interface ProductData {
  name: string;
  symbol: string;
  type: string;
  location: string;
  creator: string;
  dateOfCreation: string;
  expiryDate: string;
  latitude: string;
  longitude: string;
  ipfsUrl: string;
  qrCodes: QR[];
}

const PRODUCT_TYPES = [
  'kesar',
  'pashmina',
  'wallnut'
];

const ProductForm: React.FC<ProductFormProps> = ({ onCreate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    symbol: '',
    type: '',
    location: '',
    creator: '',
    dateOfCreation: '',
    expiryDate: '',
    latitude: '',
    longitude: '',
    ipfsUrl: '',
    qrCodes: [],
  });

  const handleChange = (field: keyof ProductData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    console.log(token);
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      // Call the onCreate function with the form data
      await onCreate(formData);
      
      // Reset form after successful creation
      setFormData({
        name: '',
        symbol: '',
        type: '',
        location: '',
        creator: '',
        dateOfCreation: '',
        expiryDate: '',
        latitude: '',
        longitude: '',
        ipfsUrl: '',
        qrCodes: [],
      });
    } catch (error) {
      console.error('Error creating product:', error);
      // If token is invalid/expired, redirect to login
      if (error) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Details Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <div className="relative">
              <Box className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="name"
                className="pl-8"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Product NFT Symbol</Label>
            <div className="relative">
              <Box className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="symbol"
                className="pl-8"
                placeholder="Enter product NFT symbol"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Product Type</Label>
            <Select 
              value={formData.type}
              onValueChange={(value: any) => handleChange('type', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creator">Creator</Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="creator"
                className="pl-8"
                placeholder="Enter creator name"
                value={formData.creator}
                onChange={(e) => handleChange('creator', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="location"
                className="pl-8"
                placeholder="Enter location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <div className="relative">
                <Navigation className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="latitude"
                  className="pl-8"
                  placeholder="Enter latitude"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <div className="relative">
                <Navigation className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="longitude"
                  className="pl-8"
                  placeholder="Enter longitude"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dates Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dateOfCreation">Date of Creation</Label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="date"
              id="dateOfCreation"
              className="pl-8"
              value={formData.dateOfCreation}
              onChange={(e) => handleChange('dateOfCreation', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <div className="relative">
            <Flag className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="date"
              id="expiryDate"
              className="pl-8"
              value={formData.expiryDate}
              onChange={(e) => handleChange('expiryDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="submit" className="min-w-[120px]">
          Create Product
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;