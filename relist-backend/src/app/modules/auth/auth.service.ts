import { userService } from "../Users/user.service";
import { IUser } from "../Users/user.interface";
import { userModel } from "../Users/user.model";
import bcrypt from "bcrypt";
import config from "../../config";
import { createToken, verifyToken } from "../Utils/auth.utils";
import httpStatus from "http-status";
import AppError from "../Error/AppError";

// Registering user service
export const registeringUserService = async (newUser: { name: string; email: string; password: string }) => {
   const { name, email, password } = newUser;

   // Check if the user already exists
   const existingUser = await userService.getSingleUser(email);
   if (existingUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "User already exists with this email");
   }

   // Hash the password
   const hashedPassword = await bcrypt.hash(password, 10);

   // Create new user object
   const userData: IUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      status: "active",
      avatar: "",
   };

   // Save user in DB
   const user = await userModel.create(userData);
   return user;
};

// Logging in user
export const loginUser = async ({ email, password }: { email: string; password: string }) => {
   const user = await userService.getSingleUser(email);

   if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
   }

   // Checking if the password is correct
   const isPasswordCorrect = await bcrypt.compare(password, user.password);
   if (!isPasswordCorrect) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
   }

   const jwtPayload = {
      email: user.email,
      role: user.role,
   };

   const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
   );

   const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
   );

   return {
      accessToken,
      refreshToken,
   };
};

// Refresh access token using refresh token
export const refreshToken = async (authorization: string) => {
   // Verify if the provided refresh token is valid
   const decoded = verifyToken(authorization, config.jwt_refresh_secret as string);
   const { email } = decoded;

   // Check if the user exists
   const user = await userService.getSingleUser(email);
   if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
   }

   // Check if the user is blocked
   if (user.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
   }

   const jwtPayload = {
      email: user.email,
      role: user.role,
   };

   const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      parseInt(config.jwt_access_expires_in as string, 10)
   );

   return {
      accessToken,
   };
};

export const authService = {
   registeringUserService,
   loginUser,
   refreshToken,
};
