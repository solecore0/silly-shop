import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Please Enter Your Address"],
      },
      city: {
        type: String,
        required: [true, "Please Enter Your City"],
      },
      state: {
        type: String,
        required: [true, "Please Enter Your State"],
      },
      country: {
        type: String,
      },
      pinCode: {
        type: Number,
        required: [true, "Please Enter Your PinCode"],
      }
    },
    user: {
        type: String,
        ref: "User",
        required: [true, "Please Enter Your ID"],
    },
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
      type: Number,
      required: true
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing"
    },
    orderItems: [{
        name: String,
        price: Number,
        photo: String,
        quantity: Number,
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "Product"
        }
    }]
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;