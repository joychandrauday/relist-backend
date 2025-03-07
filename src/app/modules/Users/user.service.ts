/* eslint-disable @typescript-eslint/no-explicit-any */
// 4.service

import { IUser } from "./user.interface"
import { userModel } from "./user.model"

// get all users
const getUsers = async (query: Record<string, unknown>) => {
  const { status, role, search, page = 1, limit } = query;

  const filters: Record<string, any> = {};

  if (status) {
    filters.status = status;
  }

  if (role) {
    filters.role = role;
  }

  if (search) {
    const searchRegex = new RegExp(search as string, "i"); // Case-insensitive search
    filters.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ];
  }

  // Pagination setup
  const pageNumber = Number(page) > 0 ? Number(page) : 1;
  const limitNumber = limit ? Number(limit) : 10;
  const skip = (pageNumber - 1) * limitNumber;

  const totalUsers = await userModel.countDocuments(filters);

  let usersQuery = userModel.find(filters);
  usersQuery = usersQuery.sort({ createdAt: -1 });

  if (limitNumber > 0) {
    usersQuery.skip(skip).limit(limitNumber);
  }

  const users = await usersQuery;
  const meta = {
    total: totalUsers,
    page: pageNumber,
    limit: limitNumber > 0 ? limitNumber : totalUsers,
    totalPages: limitNumber > 0 ? Math.ceil(totalUsers / limitNumber) : 1,
  };

  return { users, meta };
};

// edit a user
const editUser = async (id: string, updatedUser: Partial<IUser>) => {
  const user = await userModel.findByIdAndUpdate(id, updatedUser, { new: true })
  return user
}
// get single user by email
const getSingleUser = async (identifier: string) => {
  if (!identifier) {
    throw new Error('No identifier provided')
  }
  const user = await userModel
    .findById(identifier)
    .populate({
      path: 'wishlist',
      select: 'title price images' // Only fetch necessary fields
    });

  return user;
}
// get single user by email
const getSingleUserById = async (identifier: string) => {
  if (!identifier) {
    throw new Error('No identifier provided')
  }
  const user = await userModel.findOne({ email: identifier })// You can specify more fields if necessary

  return user;
}

// de;et user by id

const deleteUser = async (id: string) => {
  const user = await userModel.findByIdAndDelete(id)

  return user;
}

import mongoose from "mongoose";
type ListingIdObject = { listingId: string };

const addItemToWishlist = async (userId: string, listingId: string | ListingIdObject) => {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return null;
    }


    if (typeof listingId === "object" && "listingId" in listingId) {
      listingId = listingId.listingId;
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      throw new Error("Invalid listingId format");
    }

    const objectId = new mongoose.Types.ObjectId(listingId);


    if (user.wishlist.includes(objectId)) {
      return null;
    }


    user.wishlist.push(objectId);
    await user.save();

    return user;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};


// Remove item from user's wishlist
const removeItemFromWishlist = async (userId: string, listingId: string) => {

  const user = await userModel.findById(userId);

  if (!user) {
    return null;
  }
  const objectId = new mongoose.Types.ObjectId(listingId);
  // Remove the listing from the wishlist
  const index = user.wishlist.indexOf(objectId);
  if (index > -1) {
    user.wishlist.splice(index, 1);
    await user.save();
  }

  return user; // Return the updated user

};

// sending all to controller
export const userService = {
  getUsers,
  editUser,
  deleteUser,
  getSingleUser,
  getSingleUserById,
  addItemToWishlist,
  removeItemFromWishlist
}
