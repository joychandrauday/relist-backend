// services/listingService.ts

import { IListing } from "./listing.interface";
import { listingModel } from "./listing.model";


const createListingService = async (listingData: IListing) => {
    const newListing = new listingModel(listingData);
    return await newListing.save();
};

const getAllListingsService = async () => {
    return await listingModel.find({ status: 'available' });
};

const getListingByIdService = async (id: string) => {
    return await listingModel.findById(id);
};

const updateListingService = async (id: string, updateData: IListing) => {
    return await listingModel.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteListingService = async (id: string) => {
    return await listingModel.findByIdAndDelete(id);
};

export const listingService = {
    createListingService,
    getAllListingsService,
    getListingByIdService,
    updateListingService,
    deleteListingService,

}