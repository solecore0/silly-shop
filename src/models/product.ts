import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
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
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;