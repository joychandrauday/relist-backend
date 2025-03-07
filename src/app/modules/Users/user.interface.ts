import mongoose from "mongoose";

// User Model:
export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    avatar: string;
    wishlist: mongoose.Types.ObjectId[];
}