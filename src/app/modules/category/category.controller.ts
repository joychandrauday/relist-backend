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
// editing category using put method

const updateCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        const categoryData = req.body;

        const updatedCategory = await categoryService.editCategory(categoryId, categoryData);

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory
        });
    } catch (error) {
        let errorMessage = 'Failed to update category';

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

// deleting category using delete method
const deleteCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = req.params.id;
        await categoryService.deleteCategory(categoryId);
        res.status(204).send();
    } catch (error) {
        let errorMessage = 'Failed to delete category';
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
    getCategoryAll,
    updateCategory,
    deleteCategory,

}
