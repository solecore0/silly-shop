import Product from "../models/product.js";
import {
  CheckCacheType,
  InvalidateCacheType,
  OrderItemsType,
} from "../types/types.js";
import { Document } from "mongoose";
import {
  getCache,
  setCache,
  invalidateCache as redisInvalidateCache,
} from "../services/redis.js";

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
  await redisInvalidateCache({
    product,
    order,
    admin,
    productIDs,
    orderID,
    userID,
    coupons,
    couponID,
  });
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
    let variable = await getCache(key);

    if (!variable) {
      variable = await model.find();
      await setCache(key, variable);
    }

    return variable;
  }

  if (action === "findOne") {
    let variable = await getCache(key);

    if (!variable) {
      variable = await model.findById(id);
      if (!variable) {
        throw new Error("Invalid ID");
      }
      await setCache(key, variable);
    }

    return variable;
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
