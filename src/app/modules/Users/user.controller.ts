// 3. Controller
// adding user to database
import { Request, Response, NextFunction } from 'express';
import sendResponse from "../Utils/sendResponse";
import { userService } from "./user.service";




// getting user from database
const gettingUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Save the new user to the database
    const user = await userService.getUsers(req.query);

    // Send success response
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User retrive successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
//get single user
const gettingSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await userService.getSingleUser(userId)

    // Send success response
    res.status(200).json({
      message: 'User retrieved successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }

}
//get single user
const gettingSingleUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const user = await userService.getSingleUserById(userId)

    // Send success response
    res.status(200).json({
      message: 'User retrieved successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }

}
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    const updatedUser = await userService.editUser(userId, updatedData);

    if (!updatedUser) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'User not found!',
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User updated successfully!',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
// delete user

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'User not found!',
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'User deleted successfully!',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
const addToWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const listingId = req.body.listingId;
    console.log(userId, listingId);
    // Add the listing to the user's wishlist
    const updatedUser = await userService.addItemToWishlist(userId, listingId);

    if (!updatedUser) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'User not found or Listing not found!',
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Item added to wishlist successfully!',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const listingId = req.body.listingId;

    // Remove the listing from the user's wishlist
    const updatedUser = await userService.removeItemFromWishlist(userId, listingId);

    if (!updatedUser) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: 'User or Listing not found!',
        data: null,
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Item removed from wishlist successfully!',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
// sending to routes
export const userController = {
  updateUser,
  gettingUsers,
  gettingSingleUser,
  gettingSingleUserById,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
}
