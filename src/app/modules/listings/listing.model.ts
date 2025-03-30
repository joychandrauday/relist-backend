import mongoose, { model, Schema } from 'mongoose';
import { FlashSale } from '../flashSell/flashSale.model';
import { IListing } from './listing.interface';

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    condition: {
      type: String,
      required: true,
      enum: ['Brand New', 'Like New', 'Excellent', 'Very Good', 'Good', 'Fair', 'Refurbished', 'For Parts / Not Working'],
    },
    location: {
      city: { type: String, required: true },
      state: { type: String }, // optional
      country: { type: String, required: true },
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    offerPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

listingSchema.methods.calculateOfferPrice = async function () {
  console.log(`Running calculateOfferPrice for listing: ${this._id}`);

  const flashSale = await FlashSale.findOne({ product: this._id });
  console.log("Found Flash Sale:", flashSale);

  if (flashSale) {
    const discount = (flashSale.discountPercentage / 100) * this.price;
    this.offerPrice = this.price - discount;
    await this.save();
    return this.offerPrice;
  }

  return null;
};

export const listingModel = model<IListing>('Listing', listingSchema);
