import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import Product from "../models/product.js";
import {
  BaseQuery,
  ExtendedRequest,
  NewProductRequestBody,
  NewProductReviewRequestBody,
  NewProductReviewRequestParams,
  SearchQuery,
} from "../types/types.js";
import { rm } from "fs";
import ErrorHandler from "../utils/utility-class.js";
import { invalidateCache } from "../utils/features.js";
import { getCache, setCache } from "../services/redis.js";
import User from "../models/user.js";

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
    products = await Product.find().sort({ createdAt: -1 }).limit(6);
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
    product = await Product.findById(id).select("+reviews");

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

  // Delete thumbnail and all photos
  rm(product.thumbnail, () => {
    console.log("Thumbnail deleted");
  });

  product.photos.forEach((photo) => {
    rm(photo, () => {
      console.log("Photo deleted");
    });
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
    const { name, price, category, stock, description } = req.body;
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const product = await Product.findById(id);

    if (!product) {
      // Delete uploaded files if product not found
      if (files) {
        const allFiles = [...(files.thumbnail || []), ...(files.photos || [])];
        allFiles.forEach((file) => {
          rm(file.path, () => {
            console.log("File deleted");
          });
        });
      }
      return next(new ErrorHandler("Invalid ID", 404));
    }

    if (files) {
      if (files.thumbnail) {
        // Delete old thumbnail
        rm(product.thumbnail, () => {
          console.log("Old thumbnail deleted");
        });
        product.thumbnail = files.thumbnail[0].path;
      }

      if (files.photos) {
        // Delete old photos
        product.photos.forEach((photo) => {
          rm(photo, () => {
            console.log("Old photo deleted");
          });
        });
        product.photos = files.photos.map((file) => file.path);
      }
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (description) product.description = description;

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
    const { name, price, category, stock, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.thumbnail || !files.photos) {
      return res.status(400).json({
        success: false,
        message: "Please provide both thumbnail and photos",
      });
    }

    if (!name || !price || !category || !stock || !description) {
      // Delete uploaded files if validation fails
      const allFiles = [...files.thumbnail, ...files.photos];
      allFiles.forEach((file) => {
        rm(file.path, () => {
          console.log("File deleted");
        });
      });

      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const product = await Product.create({
      name,
      price,
      description,
      thumbnail: files.thumbnail[0].path,
      photos: files.photos.map((file) => file.path),
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

// Create, Update, Delete Product Review
export const createProductReview = TryCatch(
  async (
    req: ExtendedRequest<{}, {}, NewProductReviewRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { rating, comment, productId } = req.body;

    if (!rating || !comment) {
      return next(new ErrorHandler("Please provide all fields", 400));
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const product = await Product.findById(productId).select("+reviews");

    if (!product) {
      return next(new ErrorHandler("Invalid ID", 404));
    }

    const review = {
      user: user._id,
      name: user.name,
      rating: Number(rating),
      comment,
    };

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.avgRating = avg / product.reviews.length;

    await product.save();

    await invalidateCache({ product: true, productIDs: String(product._id) });

    return res.status(200).json({
      success: true,
      message: "Review Added Successfully",
      product,
    });
  }
);
