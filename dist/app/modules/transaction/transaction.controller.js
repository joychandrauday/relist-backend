"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const transaction_service_1 = __importDefault(require("./transaction.service"));
const AppError_1 = __importDefault(require("../Error/AppError"));
const getPurchases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const purchases = yield transaction_service_1.default.getPurchasesByUserId(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Purchase history fetched successfully',
            data: purchases
        });
    }
    catch (error) {
        let errorMessage = 'Failed to fetch purchase history.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
const getSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const sales = yield transaction_service_1.default.getSalesByUserId(userId);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Sales history fetched successfully',
            data: sales
        });
    }
    catch (error) {
        let errorMessage = 'Failed to sales history.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionData = req.body;
        const newTransaction = yield transaction_service_1.default.createTransaction(transactionData);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Transaction created successfully',
            data: newTransaction
        });
    }
    catch (error) {
        let errorMessage = 'Failed to create transaction.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['pending', 'completed'].includes(status)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid transaction status');
        }
        const updatedTransaction = yield transaction_service_1.default.updateTransactionStatus(id, status);
        if (!updatedTransaction) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Transaction not found');
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Transaction updated successfully',
            data: updatedTransaction
        });
    }
    catch (error) {
        let errorMessage = 'Failed to Update Transaction';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            success: false,
            message: errorMessage,
            data: {}
        });
    }
});
exports.transactionController = {
    getPurchases,
    getSales,
    createTransaction,
    updateTransaction
};
