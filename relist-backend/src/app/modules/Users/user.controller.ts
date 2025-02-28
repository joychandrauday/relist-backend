// 3. Controller
import { IUser } from "./user.interface";
// adding user to database
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { errorHandler } from "../Error/globalErrorHandler";
import sendResponse from "../Utils/sendResponse";
import httpStatus from 'http-status';
import { userService } from "./user.service";



// registering user by hashed password use userService
const registeringUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as unknown as { name: string, email: string, password: string };
  try {
    //  check if the user already exists
    const existingUser = await userService.getSingleUser(email);
    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      status: 'active',
      avatar: "",
      paymentMethods: [],
      cart: []
    };
    const user = await userService.registeringUserService(newUser);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    errorHandler(error as Error, res);
  }
}
// log in user
const loginUser = async (req: Request, res: Response) => {
  const user = await userService.getSingleUser(req?.body?.email);
  if (!user) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'User not Found!',
      data: null,
    });
  }
  const result = await userService.loginUser(req.body);
  if (!result) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: 'Login failed!',
      data: null,
    });
  }
  const { refreshToken, accessToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
    },
  });
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await userService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
};


// getting user from database
const gettingUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Save the new user to the database
    const user = await userService.getUsers();

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

// sending to routes
export const userController = {
  registeringUser,
  loginUser,
  updateUser,
  refreshToken,
  gettingUsers,
  gettingSingleUser,
  gettingSingleUserById,
  deleteUser
}
