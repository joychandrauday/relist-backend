import sendResponse from "../Utils/sendResponse";
import catchAsync from "../Utils/catchAsync";
import { authService } from "./auth.service";
import config from "../../config";
import { StatusCodes } from "http-status-codes";
import AppError from "../Error/AppError";

// Registering user by hashed password using userService
const registeringUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Call service function
    const user = await authService.registeringUserService({ name, email, password });

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    next(error); // Pass error to global error handler
  }
});

// Logging in user
const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser({ email, password });
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

// Logout user by blocking refresh token (clear cookie)
const logoutUser = catchAsync(async (req, res) => {
  res.clearCookie("refreshToken");

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged out successfully!",
    data: {}
  });
});

// Refresh access token using refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Refresh token is required');
  }
  const result = await authService.refreshToken(authorization);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token refreshed successfully!",
    data: {
      accessToken: result.accessToken,
    },
  });
});

export const authController = {
  registeringUser,
  loginUser,
  logoutUser,
  refreshToken,
};
