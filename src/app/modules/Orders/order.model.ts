// 5.Model

import { model, Schema } from 'mongoose'
import { IOrder } from './order.interface'

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // reference to the user who placed the order
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // reference to the product
        quantity: { type: Number, required: true }, // quantity of the product ordered
        price: { type: Number, required: true }, // price per unit of the product
        totalPrice: { type: Number, required: true }, // total price for this product (quantity * price)
      }
    ],
    amount: { type: Number, required: true }, // total price of the order (sum of all products' totalPrice)
    shippingAddress: { type: String, required: true },
    paymentStatus: {
      type: String, // e.g., 'Pending', 'Completed', 'Failed'
      required: true,
      default: 'Pending',
    },
    orderStatus: {
      type: String, // e.g., 'Processing', 'Shipped', 'Delivered', 'Cancelled'
      required: true,
    },
    orderDate: { type: Date, default: Date.now }, // the date when the order was placed
    estimatedDeliveryDate: { type: Date, required: false }, // optional, estimated delivery date
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
  { timestamps: true } // automatically adds createdAt and updatedAt fields
);


export const orderModel = model<IOrder>('Order', orderSchema)
