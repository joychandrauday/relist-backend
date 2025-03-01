// 4. Service

import { RootFilterQuery } from "mongoose";
import { IProduct } from "./product.interface";
import { productModel } from "./product.model";

const addProductToDB = async (product: IProduct) => {
  // Push new product to the database
  const result = await productModel.create(product);
  return result;
};

// Assuming you're using Mongoose for MongoDB
const getAllProducts = async (filter: RootFilterQuery<IProduct>, skip: number, limit: number, sort: string) => {
  try {
    // Fetch products based on filter, skip, and limit: Record<string, any>
    const products = await productModel.find(filter) // Apply filter
      .skip(skip) // Skip the number of products based on pagination
      .limit(limit) // Limit the number of products per page
      .sort(sort) // Sort the results based on sort criteria
      .exec(); // Execute the query

    return products;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products: " + error.message);
    } else {
      throw new Error("Error fetching products: " + String(error));
    }
  }
};



const getTotalCount = async (filter: RootFilterQuery<IProduct> | undefined) => {
  try {
    const totalCount = await productModel.countDocuments(filter); // Count products based on the filter
    return totalCount;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products: " + error.message);
    } else {
      throw new Error("Error fetching products: " + String(error));
    }
  }
};
const getSingleProduct = async (id: string) => {
  // Retrieve a single product from the database by ID
  const product = await productModel.findById(id).populate('reviews.userId', 'name avatar')
  return product;
}

const updateProductInDB = async (id: string, updatedProduct: IProduct) => {
  // Update a product in the database by ID
  const result = await productModel.findByIdAndUpdate(id, updatedProduct, { new: true });
  return result;
}

const deleteProductFromDB = async (id: string) => {
  // Delete a product from the database by ID
  const result = await productModel.findByIdAndDelete(id);
  return result;
}

export const productService = {
  addProductToDB,
  getAllProducts,
  getSingleProduct,
  updateProductInDB,
  deleteProductFromDB,
  getTotalCount
};
