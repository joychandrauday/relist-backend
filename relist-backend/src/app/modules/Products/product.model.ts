/* eslint-disable prefer-const */
import { model, Schema, UpdateQuery } from 'mongoose';
import { IProduct } from './product.interface';

// single product schema
const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, default: 0 }, // Default rating is 0
  brand: { type: String, required: true },
  status: {
    type: String,
    enum: ['sale', 'featured', 'hot'],
    default: 'featured',
  },
  price: { type: Number, required: true },
  discount: { type: Number },
  category: {
    type: String,
    enum: ['Writing', 'Office', 'Art', 'Educational', 'Technology', 'Others'],
    required: true,
  },
  images: { type: [String], required: true },
  featuredImages: { type: String, required: true },
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true, default: true },
  reviews: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      description: { type: String, required: true },
      rating: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

// Pre-update hook to recalculate rating
productSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateQuery<IProduct>; // Type cast to avoid TS errors

  if (!update) {
    return next();
  }

  // Get the product's current reviews from the database
  const product = await this.model.findOne(this.getQuery()).select('reviews');

  if (!product || !product.reviews) {
    return next();
  }

  let reviews = [...product.reviews];

  // If a new review is being pushed, add it to the array
  if (update.$push?.reviews) {
    reviews.push(update.$push.reviews);
  }

  // Calculate the new average rating
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Ensure the update contains the new rating
    if (!update.$set) {
      update.$set = {}; // Ensure $set exists
    }
    update.$set.rating = averageRating;
  }

  next();
});

// Mongoose Pre-save Hook to Recalculate Rating (for initial product creation)
productSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
  } else {
    this.rating = 0;
  }
  next();
});

export const productModel = model<IProduct>('Product', productSchema);
