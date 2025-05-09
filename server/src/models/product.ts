import mongoose from "mongoose";
import User from "./user.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Description"],
    },
    photo: {
      type: String,
      required: [true, "Please Provide Photo"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Price"],
    },
    category: {
      type: String,
      required: [true, "Please Enter Category"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Stock"],
    },
    reviews: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      select: false,
    },
    avgRating: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
