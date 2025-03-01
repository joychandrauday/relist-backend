
import { model, Schema } from 'mongoose';
import { IListing } from './listing.interface';

// single product schema
const listingSchema = new Schema<IListing>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available',
  },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const listingModel = model<IListing>('Listing', listingSchema);
