import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IListing extends Document {
    title: string;
    description: string;
    price: number;
    condition: string;
    images: string[];
    category: Types.ObjectId;
    userID: Types.ObjectId;
    status: 'available' | 'sold';
    location: {
        city: string;
        state?: string;
        country: string;
    };
    quantity: number;
    offerPrice?: number;
    calculateOfferPrice(): Promise<number | null>;
}
