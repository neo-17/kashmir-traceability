import { Router } from 'express';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, deployNftForProduct, generateProductQRCodes, getQRCodeImage, getProductByQRCode } from '../controllers/product.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Create a product
router.post('/', authenticateAdmin, createProduct);

// Get all products
router.get('/', authenticateAdmin, getAllProducts);

// Get a single product by ID
router.get('/:id', authenticateAdmin, getProductById);

// Update a product by ID
router.put('/:id', authenticateAdmin, updateProduct);

// Delete a product by ID
router.delete('/:id', authenticateAdmin, deleteProduct);

// deploy NFT contract
router.post('/:id/deployContract', authenticateAdmin, deployNftForProduct);

router.post('/:id/generate-qr', authenticateAdmin, generateProductQRCodes);

router.get('/qr-image/:code', getQRCodeImage);

router.get('/qr/:code', getProductByQRCode);

export default router;
