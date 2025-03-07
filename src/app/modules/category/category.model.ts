import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory & Document>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        icon: { type: String, required: true }
    },
    { timestamps: true }
);

const Category = mongoose.model<ICategory & Document>('Category', categorySchema);

export default Category;