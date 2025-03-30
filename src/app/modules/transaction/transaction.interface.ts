import { Types } from 'mongoose';

export interface ITransaction {
    buyerID: Types.ObjectId;
    sellerID: Types.ObjectId[];
    itemID: Types.ObjectId[];
    orderID: Types.ObjectId;
    status: 'pending' | 'completed';
}
