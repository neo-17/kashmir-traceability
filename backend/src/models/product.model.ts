import { Schema, model } from 'mongoose';

const QRCodeSchema = new Schema({
  code: { type: String, required: true },
  claimed: { type: Boolean, default: false },
  claimedBy: { type: String, default: null },
  claimedNFTUrl: { type: String, default: null },
  mintedTokenId: { type: String, default: null },
});

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    creator: { type: String, required: true },
    dateOfCreation: { type: Date, required: true },
    expiryDate: { type: Date, required: false },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    ipfsUrl: { type: String },
    contractAddress: { type: String },
    qrCodes: { type: [QRCodeSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export default model('Product', ProductSchema);
