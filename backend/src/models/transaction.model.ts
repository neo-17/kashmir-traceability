// src/models/transaction.model.ts
import { Schema, model, Types } from 'mongoose';

const TransactionSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    product: { type: Types.ObjectId, ref: 'Product', required: true }, // Reference to the product
    tokenId: { type: String, required: true }, // Minted token ID
    txHash: { type: String, required: true }, // Transaction hash
    status: { type: String, enum: ['success', 'pending', 'failed'], required: true }, // Transaction status
    createdAt: { type: Date, default: Date.now }, // Transaction creation date
  },
  {
    timestamps: true,
  }
);

export default model('Transaction', TransactionSchema);
