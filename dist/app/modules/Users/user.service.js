"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
// 4.service
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_model_1 = require("./user.model");
// get all users
const getUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, role, search, page = 1, limit } = query;
    const filters = {};
    if (status) {
        filters.status = status;
    }
    if (role) {
        filters.role = role;
    }
    if (search) {
        const searchRegex = new RegExp(search, "i"); // Case-insensitive search
        filters.$or = [
            { name: searchRegex },
            { email: searchRegex }
        ];
    }
    // Pagination setup
    const pageNumber = Number(page) > 0 ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    const skip = (pageNumber - 1) * limitNumber;
    const totalUsers = yield user_model_1.userModel.countDocuments(filters);
    let usersQuery = user_model_1.userModel.find(filters);
    usersQuery = usersQuery.sort({ createdAt: -1 });
    if (limitNumber > 0) {
        usersQuery.skip(skip).limit(limitNumber);
    }
    const users = yield usersQuery;
    const meta = {
        total: totalUsers,
        page: pageNumber,
        limit: limitNumber > 0 ? limitNumber : totalUsers,
        totalPages: limitNumber > 0 ? Math.ceil(totalUsers / limitNumber) : 1,
    };
    return { users, meta };
});
// edit a user
const editUser = (id, updatedUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findByIdAndUpdate(id, updatedUser, { new: true });
    return user;
});
// get single user by email
const getSingleUser = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    if (!identifier) {
        throw new Error('No identifier provided');
    }
    const user = yield user_model_1.userModel
        .findById(identifier)
        .populate({
        path: 'wishlist',
        select: 'title price images' // Only fetch necessary fields
    });
    return user;
});
// get single user by email
const getSingleUserById = (identifier) => __awaiter(void 0, void 0, void 0, function* () {
    if (!identifier) {
        throw new Error('No identifier provided');
    }
    const user = yield user_model_1.userModel.findOne({ email: identifier }); // You can specify more fields if necessary
    return user;
});
// de;et user by id
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findByIdAndDelete(id);
    return user;
});
const mongoose_1 = __importDefault(require("mongoose"));
const addItemToWishlist = (userId, listingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.userModel.findById(userId);
        if (!user) {
            return null;
        }
        if (typeof listingId === "object" && "listingId" in listingId) {
            listingId = listingId.listingId;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(listingId)) {
            throw new Error("Invalid listingId format");
        }
        const objectId = new mongoose_1.default.Types.ObjectId(listingId);
        if (user.wishlist.includes(objectId)) {
            return null;
        }
        user.wishlist.push(objectId);
        yield user.save();
        return user;
    }
    catch (error) {
        console.error("Error adding to wishlist:", error);
        throw error;
    }
});
// Remove item from user's wishlist
const removeItemFromWishlist = (userId, listingId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(userId);
    if (!user) {
        return null;
    }
    const objectId = new mongoose_1.default.Types.ObjectId(listingId);
    // Remove the listing from the wishlist
    const index = user.wishlist.indexOf(objectId);
    if (index > -1) {
        user.wishlist.splice(index, 1);
        yield user.save();
    }
    return user; // Return the updated user
});
// sending all to controller
exports.userService = {
    getUsers,
    editUser,
    deleteUser,
    getSingleUser,
    getSingleUserById,
    addItemToWishlist,
    removeItemFromWishlist
};
