// 4.service

import AppError from "../Error/AppError";
import { IUser } from "./user.interface"
import { userModel } from "./user.model"
import httpStatus from 'http-status';
// registering user by hashed password
import bcrypt from 'bcrypt';
import config from "../../config";
import { createToken, verifyToken } from "../Utils/auth.utils";

export type TLoginUser = {
  email: string;
  password: string;
};


export const registeringUserService = async (newUser: IUser) => {
  const result = await userModel.create(newUser)
  return result
}

// logging in user
const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await getSingleUser(payload.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  //checking if the password is correct
  const isPasswordCorrect = bcrypt.compare(payload.password, user.password);
  //create token and sent to the  client
  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    parseInt(config.jwt_access_expires_in as string, 10),
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    parseInt(config.jwt_refresh_expires_in as string, 10),
  );

  return {
    accessToken,
    refreshToken,
  };
};

// refresh token 
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  const user = await getSingleUser(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    parseInt(config.jwt_access_expires_in as string, 10),
  );

  return {
    accessToken,
  };
};



// get all users
const getUsers = async () => {
  const users = await userModel.find()
  return users
}
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

  // Populate 'cart' with 'name' and 'price' fields from the Product model
  const user = await userModel.findOne({ email: identifier })
    .populate('cart.productId', 'name price featuredImages quantity'); // You can specify more fields if necessary

  return user;
}
// get single user by email
const getSingleUserById = async (identifier: string) => {
  if (!identifier) {
    throw new Error('No identifier provided')
  }

  // Populate 'cart' with 'name' and 'price' fields from the Product model
  const user = await userModel.findById(identifier)
    .populate('cart.productId', 'name price featuredImages quantity'); // You can specify more fields if necessary

  return user;
}

// de;et user by id

const deleteUser = async (id: string) => {
  const user = await userModel.findByIdAndDelete(id)
  return user;
}
// sending all to controller
export const userService = {
  registeringUserService,
  loginUser,
  refreshToken,
  getUsers,
  editUser,
  deleteUser,
  getSingleUser,
  getSingleUserById,
}
