import { createClient } from "redis";
import { config } from "dotenv";

config({path: "../.env"})

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

// Connect to redis
export const connectToRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
};

// Cache operations
export const setCache = async (
  key: string,
  value: any,
  expireTime?: number
) => {
  try {
    const stringValue = JSON.stringify(value);
    if (expireTime) {
      await redisClient.setEx(key, expireTime, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
  } catch (error) {
    console.error("Redis set error:", error);
  }
};

export const getCache = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
};

export const deleteCache = async (keys: string | string[]) => {
  try {
    if (Array.isArray(keys)) {
      await redisClient.del(keys);
    } else {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("Redis delete error:", error);
  }
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  productIDs,
  orderID,
  userID,
  coupons,
  couponID,
}: {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  productIDs?: string | string[];
  orderID?: string;
  userID?: string;
  coupons?: boolean;
  couponID?: string;
}) => {
  try {
    const keysToDelete: string[] = [];

    if (product) {
      keysToDelete.push("latest-products", "all-products", "categories");
      if (typeof productIDs === "string")
        keysToDelete.push(`product-${productIDs}`);
      if (Array.isArray(productIDs)) {
        productIDs.forEach((id) => keysToDelete.push(`product-${id}`));
      }
    }

    if (order) {
      keysToDelete.push("all-orders");
      if (orderID) keysToDelete.push(`order-${orderID}`);
      if (userID) keysToDelete.push(`my-orders-${userID}`);
    }

    if (coupons) {
      keysToDelete.push("all-coupons");
      if (couponID) keysToDelete.push(`coupon-${couponID}`);
    }

    if (admin) {
      keysToDelete.push(
        "dashboard-stats",
        "admin-pie-charts",
        "admin-line-charts",
        "admin-bar-charts"
      );
    }

    if (keysToDelete.length > 0) {
      await deleteCache(keysToDelete);
    }
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};

export default redisClient;
