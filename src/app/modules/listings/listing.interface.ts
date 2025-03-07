// interfaces/IListing.ts
import { Types } from 'mongoose';

export interface IListing {
    title: string;
    description: string;
    price: number;
    condition: string;
    images: string[];
    category: string;
    userID: Types.ObjectId;
    status: 'available' | 'sold';
    location: {
        city: string;
        state?: string;
        country: string;
    };
}
