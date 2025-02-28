import { ObjectId } from 'mongodb';

export type IPayment = {
    user: ObjectId; // Reference to the user who made the payment
    trx_id: string; // Unique transaction ID
    amount: number; // Payment amount
    orderId: ObjectId; // Order ID
    status: 'Pending' | 'Completed' | 'Failed' | 'Cancelled'; // Payment status
    date: Date; // Payment date
};
