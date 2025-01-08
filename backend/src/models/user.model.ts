// src/models/user.model.ts
import { Schema, model, Types } from 'mongoose';

const UserClaimSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  tokenId: { type: Number, default: null },     // If you parse out the minted tokenId
  claimedAt: { type: Date, default: Date.now }, // When the user claimed it
  claimedNFTUrl: { type: String, default: null },
});

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    // Do NOT store the PIN or privateKey in plain text
    salt: { type: String, required: true },
    smartAccountAddress: { type: String },

    // Array of claim objects
    claims: {
      type: [UserClaimSchema],
      default: [],
    },

    transactions: [{ type: Types.ObjectId, ref: 'Transaction' }], // Link to transactions
  },
  {
    timestamps: true,
  }
);

export default model('User', UserSchema);
