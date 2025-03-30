import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Listing', required: true }, // reference to the product
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },

    shippingAddress: { type: String, required: true },

    paymentStatus: {
      type: String,
      required: true,
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      required: true,
    },

    orderDate: { type: Date, default: Date.now },

    estimatedDeliveryDate: { type: Date, required: false },

    transaction: {
      id: String,
      code: Number,
      message: String,
      status: String,
      method: String,
      bank_status: String,
      date_time: String,
    },
  },
  { timestamps: true }
);

export const orderModel = model<IOrder>('Order', orderSchema);
