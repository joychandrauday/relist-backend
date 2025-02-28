import { Request, Response } from 'express';
import { listingService } from './listing.service';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import AppError from '../Error/AppError';
import { verifyToken } from '../Utils/authMiddleware';
import { userService } from '../Users/user.service';

// 1. Add a new listing to the database
const addingListing = async (req: Request, res: Response) => {
    try {
        const listing = req.body;
        const user = await userService.getSingleUser(req.user.email);
        listing.userID = user._id;
        console.log(user._id);

        // Create the listing with the added userId
        const newListing = await listingService.createListingService(listing);

        // Send response
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Listing added successfully',
            data: newListing
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to add listing',
            data: {}
        });
    }
};


// 2. Get all listings from the database
const gettingListings = async (req: Request, res: Response) => {
    try {
        const listings = await listingService.getAllListingsService();
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Listings retrieved successfully',
            data: listings
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to retrieve listings',
            data: {}
        });
    }
};

// 3. Get a single listing from the database
const gettingListing = async (req: Request, res: Response) => {
    try {
        const listingId = req.params.listingId;
        const listing = await listingService.getListingByIdService(listingId);

        if (!listing) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Listing retrieved successfully',
            data: listing
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to retrieve listing',
            data: {}
        });
    }
};

// 4. Update a listing
const updatingListing = async (req: Request, res: Response) => {
    try {
        const listingId = req.params.listingId;
        const updatedListing = req.body;
        const updatedListingData = await listingService.updateListingService(listingId, updatedListing);

        if (!updatedListingData) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Listing updated successfully',
            data: updatedListingData
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to update listing',
            data: {}
        });
    }
};

// 5. Delete a listing from the database
const deletingListing = async (req: Request, res: Response) => {
    try {
        const listingId = req.params.listingId;
        const deletedListing = await listingService.deleteListingService(listingId);

        if (!deletedListing) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Listing deleted successfully',
            data: {}
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to delete listing',
            data: {}
        });
    }
};

// Applying the verifyToken middleware to protect routes that need authentication
export const listingController = {
    addingListing: [verifyToken, addingListing],
    gettingListings: [verifyToken, gettingListings],
    gettingListing,
    updatingListing: [verifyToken, updatingListing],
    deletingListing: [verifyToken, deletingListing]
};
