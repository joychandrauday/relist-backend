/* eslint-disable @typescript-eslint/no-explicit-any */
// services/listingService.ts

import mongoose from "mongoose";
import { IListing } from "./listing.interface";
import { listingModel } from "./listing.model";


const createListingService = async (listingData: IListing) => {
    const newListing = new listingModel(listingData);
    return await newListing.save();
};

const getAllListingsService = async (query: Record<string, unknown>) => {
    const { minPrice, maxPrice, search, category, status, condition, city, page = 1, limit } = query;

    const filters: Record<string, any> = {};

    if (status) {
        filters.status = status;
    }


    if (category && typeof category === 'string' && category !== '{}' && mongoose.Types.ObjectId.isValid(category)) {
        filters.category = new mongoose.Types.ObjectId(category); // Use the valid ObjectId
    } else if (category && category === '{}') {
        console.error('Invalid category passed (empty object)');
    }


    if (condition) {
        filters.condition = condition;
    }

    if (city) {
        filters["location.city"] = city;
    }

    if (minPrice || maxPrice) {
        filters.price = {};

        if (minPrice) {
            filters.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            filters.price.$lte = Number(maxPrice);
        }
    }

    if (search) {
        const searchRegex = new RegExp(search as string, "i"); // Case-insensitive search
        filters.$or = [
            { title: searchRegex },
            { description: searchRegex }
        ];
    }

    // Pagination setup
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalListings = await listingModel.countDocuments(filters);

    let listingsQuery = listingModel.find(filters);
    listingsQuery.populate("userID", 'name email avatar _id').populate("category", 'name description icon _id');
    listingsQuery = listingsQuery.sort({ createdAt: -1 });

    if (limitNumber > 0) {
        listingsQuery.skip(skip).limit(limitNumber);
    }

    const listings = await listingsQuery;
    const meta = {
        total: totalListings,
        page: pageNumber,
        limit: limitNumber > 0 ? limitNumber : totalListings,
        totalPages: limitNumber > 0 ? Math.ceil(totalListings / limitNumber) : 1,
    };

    return { listings, meta };
};




const getListingByIdService = async (id: string) => {
    return await listingModel.findById(id).populate("userID", 'name email avatar _id').populate('category');
};

const updateListingService = async (id: string, updateData: IListing) => {
    return await listingModel.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteListingService = async (id: string) => {
    return await listingModel.findByIdAndDelete(id);
};
// get listing by user email

const getListingByUserIdService = async (userId: string, query: Record<string, unknown>) => {
    const { minPrice, maxPrice, search, category, status, page = 1, limit } = query;

    const filters: Record<string, any> = { userID: userId }; // First filter by userId

    if (status) {
        filters.status = status;
    }
    if (category) {
        filters.category = category;
    }

    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = Number(minPrice);
        if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    if (search) {
        const searchRegex = new RegExp(search as string, "i"); // Case-insensitive search
        filters.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Pagination setup
    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = limit ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalListings = await listingModel.countDocuments(filters);

    const listingsQuery = listingModel
        .find(filters)
    listingsQuery.populate("userID", 'name email avatar _id');
    if (limitNumber > 0) {
        listingsQuery.skip(skip).limit(limitNumber);
    }

    const listings = await listingsQuery;

    const meta = {
        total: totalListings,
        page: pageNumber,
        limit: limitNumber > 0 ? limitNumber : totalListings,
        totalPages: limitNumber > 0 ? Math.ceil(totalListings / limitNumber) : 1,
    };

    return { listings, meta };
};

export const listingService = {
    createListingService,
    getAllListingsService,
    getListingByIdService,
    updateListingService,
    deleteListingService,
    getListingByUserIdService

}