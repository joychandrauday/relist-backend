import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import messageService from './message.service';
import { verifyToken } from '../Utils/authMiddleware';

const sendMessage = async (req: Request, res: Response) => {
    try {
        const messageData = req.body;
        const newMessage = await messageService.sendMessage(messageData);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Message sent successfully',
            data: newMessage
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to send message',
            data: {}
        });
    }
};

const getUserMessages = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const messages = await messageService.getUserMessages(userId);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Messages retrieved successfully',
            data: messages
        });
    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.BAD_REQUEST,
            success: false,
            message: error.message || 'Failed to retrieve messages',
            data: {}
        });
    }
};

export const messageController = {
    getUserMessages: [verifyToken, getUserMessages],
    sendMessage: [verifyToken, sendMessage]
}
