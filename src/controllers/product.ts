import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchQuery,
} from "../types/types.js";
import { rm } from "fs";
import ErrorHandler from "../utils/utility-class.js";
import { invalidateCache } from "../utils/features.js";
import { getCache, setCache } from "../services/redis.js";

export const getAllProducts = TryCatch(async (req, res, next) => {
  let products = await getCache("all-products");

  if (!products) {
    products = await Product.find();
    await setCache("all-products", products);
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products = await getCache("latest-products");

  if (!products) {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
    await setCache("latest-products", products);
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getCategories = TryCatch(async (req, res, next) => {
  let categories = await getCache("categories");

  if (!categories) {
    categories = await Product.distinct("category");
    await setCache("categories", categories);
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getProductDetails = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product = await getCache(`product-${id}`);

  if (!product) {
    product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Invalid ID Or Product Not Found", 404));
    }

    await setCache(`product-${id}`, product);
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export const getProducts = TryCatch(
  async (
    req: Request<{}, {}, {}, SearchQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { query, price, category, sort } = req.query;
    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (query) baseQuery.name = { $regex: query, $options: "i" };
    if (price) baseQuery.price = { $lte: Number(price) };
    if (category) baseQuery.category = category;

    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    const [products, totalProducts] = await Promise.all([
      productsPromise,
      Product.countDocuments(baseQuery),
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPages,
    });
  }
);

// Delete A Product

export const deleteProduct = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Invalid ID", 404));
  }

  rm(product.photo, () => {
    console.log("File deleted");
  });
  await product.deleteOne();

  await invalidateCache({
    product: true,
    productIDs: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Update A Product

export const updateProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler("Invalid ID", 404));
    }

    if (photo) {
      rm(product.photo, () => {
        console.log("File deleted");
        product.photo = photo.path;
      });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.name = stock;

    await product.save();

    await invalidateCache({ product: true, productIDs: String(product._id) });

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
    });
  }
);

// Create A New Product

export const createProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, price, category, stock } = req.body;

    const photo = req.file;

    if (!photo) {
      return res.status(400).json({
        success: false,
        message: "Please provide product photo",
      });
    }

    if (!name || !price || !category || !stock) {
      rm(photo.path, () => {
        console.log("File deleted");
      });
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const product = await Product.create({
      name,
      price,
      photo: photo.path,
      category: category.toLowerCase(),
      stock,
    });

    await invalidateCache({ product: true });

    return res.status(201).json({
      success: true,
      product,
    });
  }
);
