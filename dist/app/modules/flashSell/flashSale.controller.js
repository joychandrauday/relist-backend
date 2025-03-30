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
exports.FlashSaleController = void 0;
const flashSale_service_1 = require("./flashSale.service");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../Utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const createFlashSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield flashSale_service_1.FlashSaleService.createFlashSale(req.body, req.user);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.CREATED,
            success: true,
            message: 'Flash Sale created succesfully',
            data: result,
        });
    }
    catch (error) {
        let errorMessage = "Failed to add Flashsale";
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
const getActiveFlashSalesService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield flashSale_service_1.FlashSaleService.getActiveFlashSalesService(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Flash Sale created succesfully',
        meta: result.meta,
        data: result.result
    });
}));
const removeFromFlashSaleController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const result = yield flashSale_service_1.FlashSaleService.removeFromFlashSale(productId);
        res.status(200).json({ success: true, message: result.message });
    }
    catch (error) {
        let errorMessage = "Failed to add Flashsale";
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
exports.FlashSaleController = {
    createFlashSale,
    getActiveFlashSalesService,
    removeFromFlashSaleController
};
