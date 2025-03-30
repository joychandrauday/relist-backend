import { Request, Response } from "express";
import { FlashSaleService } from "./flashSale.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../Utils/catchAsync";
import sendResponse from "../Utils/sendResponse";
import { AuthenticatedRequest } from "../listings/listing.controller";
import { IJwtPayload } from "../auth/auth.interface";

const createFlashSale = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await FlashSaleService.createFlashSale(
      req.body,
      req.user as IJwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Flash Sale created succesfully',
      data: result,
    });
  } catch (error) {
    let errorMessage = "Failed to add Flashsale";

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

const getActiveFlashSalesService = catchAsync(async (req: Request, res: Response) => {
  const result = await FlashSaleService.getActiveFlashSalesService(
    req.query
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Flash Sale created succesfully',
    meta: result.meta,
    data: result.result
  });
});
const removeFromFlashSaleController = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const result = await FlashSaleService.removeFromFlashSale(productId);

    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    let errorMessage = "Failed to add Flashsale";

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
export const FlashSaleController = {
  createFlashSale,
  getActiveFlashSalesService,
  removeFromFlashSaleController
}