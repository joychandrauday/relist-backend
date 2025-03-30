/* eslint-disable @typescript-eslint/no-explicit-any */

import { IJwtPayload } from "../auth/auth.interface";
import { ICreateFlashSaleInput } from "./flashSale.interface";
import { FlashSale } from "./flashSale.model";
import QueryBuilder from "../Utils/QueryBuilder";
import { listingModel } from "../listings/listing.model";

const createFlashSale = async (flashSellData: ICreateFlashSaleInput, authUser: IJwtPayload) => {
  const { products, discountPercentage } = flashSellData;
  const createdBy = authUser.userId;

  const operations = products.map((product) => ({
    updateOne: {
      filter: { product },
      update: {
        $setOnInsert: {
          product,
          discountPercentage,
          createdBy,
        },
      },
      upsert: true,
    },
  }));

  const result = await FlashSale.bulkWrite(operations);

  // ✅ Ensure each product updates its offerPrice
  await Promise.all(
    products.map(async (productId) => {
      const listing = await listingModel.findById(productId);
      if (listing) {
        const newOfferPrice = await listing.calculateOfferPrice();
        if (newOfferPrice !== null) {
          await listingModel.updateOne({ _id: productId }, { $set: { offerPrice: newOfferPrice } });
        }
      }
    })
  );

  return result;
};

const getActiveFlashSalesService = async (query: Record<string, unknown>) => {
  const flashSaleQuery = new QueryBuilder(
    FlashSale.find()
      .populate({
        path: 'product',
        select: 'title price offerPrice images price status quantity', // ✅ Include offerPrice
      }),
    query
  ).paginate();

  const flashSales = await flashSaleQuery.modelQuery.lean();

  const productsWithOfferPrice = await Promise.all(
    flashSales.map(async (flashSale: any) => {
      const product = flashSale.product;
      const discountPercentage = flashSale.discountPercentage;

      if (discountPercentage) {
        const discount = (discountPercentage / 100) * product.price;
        product.offerPrice = product.price - discount;

        // ✅ Ensure offerPrice updates in DB
        await listingModel.updateOne({ _id: product._id }, { $set: { offerPrice: product.offerPrice } });
      }

      return product;
    })
  );

  const meta = await flashSaleQuery.countTotal();

  return {
    meta,
    result: productsWithOfferPrice,
  };
};
const removeFromFlashSale = async (productId: string) => {
  // Step 1: Remove the product from FlashSale
  const flashSale = await FlashSale.findOneAndDelete({ product: productId });

  if (!flashSale) {
    throw new Error("Product not found in Flash Sale");
  }

  // Step 2: Reset the offerPrice in the Listing model
  await listingModel.updateOne(
    { _id: productId },
    { $set: { offerPrice: 0 } }
  );

  return { message: "Product removed from Flash Sale and offer price reset" };
};


export const FlashSaleService = {
  createFlashSale,
  getActiveFlashSalesService,
  removeFromFlashSale
};
