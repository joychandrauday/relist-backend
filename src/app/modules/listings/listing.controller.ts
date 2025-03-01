import { Request, Response } from 'express';
import { listingService } from './listing.service';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import AppError from '../Error/AppError';
import { verifyToken } from '../Utils/authMiddleware';
import { userService } from '../Users/user.service';
export interface AuthenticatedRequest extends Request {
    user?: { email: string, role: string };
}

// 1. Add a new listing to the database
const addingListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const listing = req.body;
        if (!req.user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
        }
        const userdb = await userService.getSingleUser(req.user.email);
        if (!userdb) {
            throw new Error("Unauthorized request");
        }
        listing.userID = userdb._id;

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
        let errorMessage = "Failed to add listing";

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
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
        let errorMessage = 'Failed to retrieve listings'

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
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
        let errorMessage = 'Failed to retrieve listing'

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};

// 4. Update a listing
const updatingListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const listingId = req.params.listingId;

        // Fetch the existing listing
        const existingListing = await listingService.getListingByIdService(listingId);
        if (!existingListing) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
        }
        if (!req.user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

        }
        // Fetch user details
        const user = await userService.getSingleUser(req.user.email);
        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

        }
        // Ensure the user is authorized to update the listing
        if (existingListing.userID.toString() !== user._id.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized to update this listing');
        }

        // Update the listing
        const updatedListing = req.body;
        const updatedListingData = await listingService.updateListingService(listingId, updatedListing);

        // Send success response
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Listing updated successfully',
            data: updatedListingData
        });
    } catch (error) {
        let errorMessage = 'Failed to update listing';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};


// 5. Delete a listing from the database
const deletingListing = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const listingId = req.params.listingId;
        // Fetch the existing listing
        const existingListing = await listingService.getListingByIdService(listingId);
        if (!existingListing) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
        }
        if (!req.user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
        }
        // Fetch user details
        const user = await userService.getSingleUser(req.user.email);
        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'user not found');
        }
        console.log(existingListing.userID.toString(), user._id.toString(), user.email);

        // Ensure the user is authorized to update the listing
        if (existingListing.userID.toString() !== user._id.toString()) {
            throw new AppError(StatusCodes.FORBIDDEN, 'You are not authorized to update this listing');
        }
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
        let errorMessage = 'Failed to delete listing';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};
// 6. get listings by user email

const gettingListingsByUserEmail = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');

        }
        const userEmail = req.user.email;
        const user = await userService.getSingleUserById(userEmail);

        if (!user) {
            throw new AppError(StatusCodes.NOT_FOUND, 'User not found');
        }
        const listings = await listingService.getListingByUserIdService(user._id.toString());


        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Listings retrieved successfully',
            data: listings
        });
    } catch (error) {
        let errorMessage = 'Failed to retrieve listings';

        if (error instanceof Error) {
            errorMessage = error.message;
        }
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
};


// Applying the verifyToken middleware to protect routes that need authentication
export const listingController = {
    addingListing: [verifyToken, addingListing],
    gettingListings: [gettingListings],
    gettingListing,
    updatingListing: [verifyToken, updatingListing],
    deletingListing: [verifyToken, deletingListing],
    gettingListingsByUserEmail: [verifyToken, gettingListingsByUserEmail]
};
