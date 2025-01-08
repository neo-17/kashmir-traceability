// src/routes/nft.routes.ts
import { Router } from 'express';
import { mintNFTForUser } from '../controllers/nft.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint to mint the NFT
router.post('/mint', authenticateUser, mintNFTForUser);

export default router;
