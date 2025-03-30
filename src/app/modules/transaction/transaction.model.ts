
import { model, Schema } from 'mongoose';
import { ITransaction } from './transaction.interface';

// single product schema
const transactionSchema = new Schema<ITransaction>(
    {
        buyerID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sellerID: [{
            type: Schema.Types.ObjectId,
            ref: 'User', required: true
        }],
        itemID: [{
            type: Schema.Types.ObjectId,
            ref: 'Listing', required: true
        }],
        orderID: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
    },
    { timestamps: true }
);

export const transactionModel = model<ITransaction>('Transaction', transactionSchema);
