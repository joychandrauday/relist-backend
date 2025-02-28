import express from 'express';
import { listingController } from './listing.controller';

const router = express.Router();

// Protect routes with JWT authentication middleware
router.post('/', listingController.addingListing);
router.get('/all', listingController.gettingListings);
router.get('/user', listingController.gettingListingsByUserEmail);
router.get('/:listingId', listingController.gettingListing);
router.put('/:listingId', listingController.updatingListing);
router.delete('/:listingId', listingController.deletingListing);

export const ListingRoutes = router;
