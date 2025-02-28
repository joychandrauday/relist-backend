import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who made the payment
    trx_id: { type: String, required: true, unique: true }, // Unique transaction ID
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true }, // Payment amount
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Cancelled'],
      required: true,
      default: 'Pending',
    }, // Payment status
    date: { type: Date, default: Date.now }, // Payment date
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export const paymentModel = model<IPayment>('Payment', paymentSchema);
