import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import categoryService from './category.service';

const addCategory = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body;
        const newMessage = await categoryService.addCategory(categoryData);

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

const getCategoryAll = async (req: Request, res: Response) => {
    try {
        const messages = await categoryService.getCategory();

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

export const categoryController = {
    addCategory,
    getCategoryAll
}
