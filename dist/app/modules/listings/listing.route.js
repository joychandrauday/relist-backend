"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const listing_controller_1 = require("./listing.controller");
const router = express_1.default.Router();
// Protect routes with JWT authentication middleware
router.post('/', listing_controller_1.listingController.addingListing);
router.get('/all', listing_controller_1.listingController.gettingListings);
router.get('/user', listing_controller_1.listingController.gettingListingsByUserEmail);
router.get('/:listingId', listing_controller_1.listingController.gettingListing);
router.put('/:listingId', listing_controller_1.listingController.updatingListing);
router.delete('/:listingId', listing_controller_1.listingController.deletingListing);
exports.ListingRoutes = router;
