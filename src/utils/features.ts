import { myCache } from "../app.js";
import Product from "../models/product.js";
import {
  CheckCacheType,
  InvalidateCacheType,
  OrderItemsType,
} from "../types/types.js";
import { Document } from "mongoose";

export const invalidateCache = async ({
  product,
  order,
  admin,
  productIDs,
  orderID,
  userID,
  coupons,
  couponID,
}: InvalidateCacheType) => {
  if (product) {
    const productKeys: string[] = [
      "latest-products",
      "all-products",
      "categories",
    ];

    if (typeof productIDs === "string")
      productKeys.push(`product-${productIDs}`);
    if (typeof productIDs === "object")
      productIDs.forEach((id) => productKeys.push(`product-${id}`));

    myCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = ["all-orders"];

    if (orderID) orderKeys.push(`order-${orderID}`);
    if (userID) orderKeys.push(`my-orders-${userID}`);

    myCache.del(orderKeys);
  }
  if (coupons) {
    const couponKeys = ["all-coupons"];

    if (couponID) couponKeys.push(`coupon-${couponID}`);

    myCache.del(couponKeys);
  }

  myCache.del("dashboard-stats");

  if (admin) {
    const adminKeys = [
      "admin-dashboard-stats",
      "admin-pie-charts",
      "admin-line-charts",
      "admin-bar-charts",
    ];
    myCache.del(adminKeys);
  }
};

export const reduceStock = async (orderItems: OrderItemsType[]) => {
  const orderItemsArray = orderItems;
  orderItemsArray.forEach(async (item) => {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error("Invalid Product ID/Product Not Found");
    product.stock = product.stock - item.quantity;
    await product.save();
  });
};

export const checkCache = async (
  key: string,
  model: any,
  action: string,
  id?: string
) => {
  if (action === "findAll") {
    let variable = [];

    if (myCache.has(key)) return JSON.parse(myCache.get(key) as string);
    else {
      variable = await model.find();
      myCache.set(key, JSON.stringify(variable));
    }

    return variable;
  }

  if (action === "findOne") {
    let variable;

    if (myCache.has(key)) return JSON.parse(myCache.get(key) as string);
    else {
      variable = await model.findById(id);
      myCache.set(key, JSON.stringify(variable));

      if (!variable) {
        throw new Error("Invalid ID");
      }

      return variable;
    }
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  let percentage = ((thisMonth - lastMonth) / lastMonth) * 100;
  if (lastMonth === 0) percentage = thisMonth * 100;
  return percentage;
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromise = categories.map((category) =>
    Product.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromise);

  const categoryCount: Record<string, number>[] = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });

  return categoryCount;
};

interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}
type FuncProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: FuncProps) => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });

  return data;
};