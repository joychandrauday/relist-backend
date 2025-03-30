import mongoose, { Schema, Document } from 'mongoose';
import { INewsLetter } from './newsletter.interface';

const newsletterSchema = new Schema<INewsLetter & Document>(
    {
        email: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

const NewsLetter = mongoose.model<INewsLetter & Document>('Newsletter', newsletterSchema);

export default NewsLetter;