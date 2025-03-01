/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express'
import { productService } from './product.service'

// 1. adding a new product to the database

const addingProduct = async (req: Request, res: Response) => {
  try {
    // Add product to the database
    const product = req.body
    const newProduct = await productService.addProductToDB(product)
    // Send success response
    res.status(201).json({
      message: 'Product added successfully',
      success: true,
      data: newProduct,
    })
  } catch (error) {
    // Handle and send error response
    res.status(400).json({
      success: false,
      message: error || 'Failed to add product',
      error,
    })
  }
}

// 2. getting all products from database

const gettingProducts = async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      inStock,
      status,
      minQuantity,
      maxQuantity,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      page, // Default to page 1 if not provided
      perPage, // Default to 10 products per page if not provided
      sortBy,
      sortOrder = "asc", // Default to ascending order
    } = req.query;

    // Create a filter object
    const filter: any = {};

    // Add filters based on query parameters
    if (name) filter.name = { $regex: new RegExp(name as string, "i") }; // Case-insensitive name search
    if (brand) filter.brand = { $regex: new RegExp(brand as string, "i") }; // Case-insensitive brand search
    if (category) filter.category = category;
    if (inStock) filter.inStock = inStock === "true"; // Convert string to boolean
    if (status) {
      // Ensure the status is one of the accepted values: "hor", "sale", "featured"
      const validStatuses = ["hot", "sale", "featured"];
      if (validStatuses.includes(status as string)) {
        filter.status = status;
      }
    }
    if (minQuantity) filter.quantity = { ...filter.quantity, $gte: parseInt(minQuantity as string) };
    if (maxQuantity) filter.quantity = { ...filter.quantity, $lte: parseInt(maxQuantity as string) };
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };
    if (minRating) filter.rating = { ...filter.rating, $gte: parseFloat(minRating as string) };
    if (maxRating) filter.rating = { ...filter.rating, $lte: parseFloat(maxRating as string) };

    // Pagination: Calculate skip and limit values
    const skip = (parseInt(page as string) - 1) * parseInt(perPage as string);
    const limit = parseInt(perPage as string);

    // Sorting: Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === "desc" ? -1 : 1; // Use descending order for 'desc' and ascending for 'asc'
    }

    // Fetch filtered products with pagination and sorting
    const products = await productService.getAllProducts(filter, skip, limit, sort);

    // Get total count for pagination metadata
    const totalCount = await productService.getTotalCount(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Send success response with pagination metadata
    res.status(200).json({
      message: "Products retrieved successfully",
      success: true,
      data: products,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        perPage: perPage,
      },
    });
  } catch (error) {
    // Handle and send error response
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to retrieve products",
      error,
    });
  }
};




// 3. getting single product from database

const gettingProduct = async (req: Request, res: Response) => {
  try {
    // Get product from the database by id
    const id = req.params.productId
    const product = await productService.getSingleProduct(id)

    // Send success response
    res.status(200).json({
      message: 'Product retrieved successfully',
      success: true,
      data: product,
    })
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error,
    })
  }
}

// 4. Update product 

const updatingProduct = async (req: Request, res: Response) => {
  try {
    // Update product in the database by id
    const id = req.params.productId
    const updatedProduct = req.body
    const updatedProductData = await productService.updateProductInDB(id, updatedProduct)

    // Send success response
    res.status(200).json({
      message: 'Product updated successfully',
      status: true,
      data: updatedProductData,
    })
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error,
    })
  }
}

// 5. Delete product from database

const deletingProduct = async (req: Request, res: Response) => {
  try {
    // Delete product from the database by id
    const id = req.params.productId
    await productService.deleteProductFromDB(id)

    // Send success response
    res.status(200).json({
      message: 'Product deleted successfully',
      status: true,
      data: {}
    })
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error,
    })
  }
}


export const productController = {
  addingProduct,
  gettingProducts,
  gettingProduct,
  updatingProduct,
  deletingProduct
}
