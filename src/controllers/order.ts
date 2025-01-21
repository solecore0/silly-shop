import { NextFunction, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import { ExtendedRequest, NewOrderRequestBody } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import Order from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import { myCache } from "../app.js";

export const createNewOrder = TryCatch(
  async (
    req: ExtendedRequest<{}, {}, NewOrderRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const {
      shippingInfo,
      subtotal,
      tax,
      discount,
      total,
      orderItems,
      shippingCharges,
    } = req.body;

    if (
      !shippingInfo ||
      !subtotal ||
      !tax ||
      !total ||
      !orderItems ||
      !shippingCharges
    ) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    if (req.user) {
      const order = await Order.create({
        shippingInfo,
        subtotal,
        user: req.user._id,
        tax,
        shippingCharges,
        discount,
        total,
        orderItems,
      });

      await reduceStock(orderItems);

      await invalidateCache({
        product: true,
        order: true,
        admin: true,
        productIDs: orderItems.map((item) => item.productId),
        orderID: String(order._id),
      });

      return res
        .status(200)
        .json({ success: true, message: "Order Placed Successfully!" });
    }
  }
);

export const getAllOrders = TryCatch(async (req, res, next) => {
  let orders = [];

  if (myCache.has("all-orders"))
    orders = JSON.parse(myCache.get("all-orders") as string);
  else {
    orders = await Order.find().populate("user", "name");
    myCache.set("all-orders", JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getMyOrders = TryCatch(async (req, res, next) => {
  const id = req.user?._id;
  let orders = [];
  let key = `my-orders-${id}`;

  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({ user: id }).populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const getOrderDetails = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  let order;
  let key = `order-${id}`;

  if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    myCache.set(key, JSON.stringify(order));
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await order.deleteOne();

  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    orderID: String(order._id),
    userID: String(order.user),
  });

  return res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});

export const updateOrder = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const order = await Order.findById(id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await invalidateCache({
    product: true,
    order: true,
    admin: true,
    orderID: String(order._id),
    userID: String(order.user),
  });

  await order.save();

  return res.status(200).json({
    success: true,
    message: "Order Updated Successfully",
  });
});
