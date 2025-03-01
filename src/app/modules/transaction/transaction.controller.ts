import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../Utils/sendResponse';
import transactionService from './transaction.service';
import AppError from '../Error/AppError';

const getPurchases = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const purchases = await transactionService.getPurchasesByUserId(userId);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Purchase history fetched successfully',
            data: purchases
        });
    } catch (error) {
        let errorMessage = 'Failed to fetch purchase history.';

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

const getSales = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const sales = await transactionService.getSalesByUserId(userId);
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Sales history fetched successfully',
            data: sales
        });
    } catch (error) {
        let errorMessage = 'Failed to sales history.';

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

const createTransaction = async (req: Request, res: Response) => {
    try {
        const transactionData = req.body;
        const newTransaction = await transactionService.createTransaction(transactionData);
        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: 'Transaction created successfully',
            data: newTransaction
        });
    } catch (error) {
        let errorMessage = 'Failed to create transaction.'

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

const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'completed'].includes(status)) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid transaction status');
        }

        const updatedTransaction = await transactionService.updateTransactionStatus(id, status);
        if (!updatedTransaction) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Transaction not found');
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Transaction updated successfully',
            data: updatedTransaction
        });
    } catch (error) {
        let errorMessage = 'Failed to Update Transaction';

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

export const transactionController = {
    getPurchases,
    getSales,
    createTransaction,
    updateTransaction
}