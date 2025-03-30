/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import messageService from './message.service';
import { userService } from '../Users/user.service';
import { userModel } from '../Users/user.model';
import { sendEmail } from '../Utils/sendEmailFunc';

const getUserSidebarController = async (req: Request, res: Response) => {
  try {
    const { userId, search } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    let query: any = { _id: { $ne: userId } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const filteredUsers = await userModel.find(query).select("-password -wishlist");

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Users retrieved successfully",
      data: filteredUsers,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve users",
      data: {},
    });
  }
};

const getUserSidebarSingleController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;  // Extract from body

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const User = await userService.getSingleUser(userId)
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Users retrieved successfully",
      data: User,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: error instanceof Error ? error.message : "Failed to retrieve users",
      data: {},
    });
  }
};



const sendMessage = async (req: Request, res: Response) => {
  try {
    const messageData = req.body;

    // Send email to the receiver
    const newMessage = await messageService.sendMessage(messageData);
    const { receiverID, message } = newMessage;

    const receiver = await userService.getSingleUser(receiverID.toString());
    if (!receiver) return;
    const receiverEmail = receiver.email;

    // Send email to the receiver
    const emailSubject = 'You have a new message!';
    const emailBody = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
              }
              .header {
                background-color: #FB8600;
                color: #fff;
                padding: 10px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                padding: 20px;
                font-size: 16px;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #666;
                margin-top: 20px;
              }
              .footer a {
                color: #2a9d8f;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h2>RE-LIST - Second Hand Marketplace</h2>
              </div>
              <div class="content">
                <p>Hi there,</p>
                <p>You have received a new message regarding an item on RE-LIST: <strong>"${message}"</strong></p>
                <p>Please visit <a href="https://relistshop.vercel.app/">our platform</a> to check out more details and respond accordingly.</p>
                <p>Thank you for being a part of RE-LIST!</p>
              </div>
              <div class="footer">
                <p>If you have any questions, feel free to contact us at <a href="mailto:joychandraud@gmail.com">joychandraud@gmail.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `;
    await sendEmail(receiverEmail, emailSubject, emailBody);


    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    let errorMessage = 'Failed to send message';

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


const getUserMessages = async (req: Request, res: Response) => {
  try {
    const { userId, recieverId } = req.params;
    const messages = await messageService.getUserMessages(userId, recieverId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Messages retrieved successfully',
      data: messages
    });
  } catch (error) {
    let errorMessage = 'Failed to retrieve message';

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

export const messageController = {
  getUserMessages,
  sendMessage,
  getUserSidebarController,
  getUserSidebarSingleController
};
