import { getCache, setCache } from "../services/redis.js";
import { TryCatch } from "../middlewares/error.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import {
  calculatePercentage,
  getChartData,
  getInventories,
} from "../utils/features.js";

export const getStats = TryCatch(async (req, res, next) => {
  let stats;
  const key = "dashboard-stats";

  stats = await getCache(key);
  if (!stats) {
    const today = new Date();

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonthUsersPromise = User.find({
      createdAt: {
        $gte: thisMonthStart,
        $lte: today,
      },
    });

    const lastMonthUsersPromise = User.find({
      createdAt: {
        $gte: lastMonthStart,
        $lte: lastMonthEnd,
      },
    });

    const thisMonthProductPromise = Product.find({
      createdAt: {
        $gte: thisMonthStart,
        $lte: today,
      },
    });

    const lastMonthProductPromise = Product.find({
      createdAt: {
        $gte: lastMonthStart,
        $lte: lastMonthEnd,
      },
    });

    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonthStart,
        $lte: today,
      },
    });

    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonthStart,
        $lte: lastMonthEnd,
      },
    });

    const sixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const [
      thisMonthUsers,
      lastMonthUsers,
      thisMonthProduct,
      lastMonthProduct,
      thisMonthOrder,
      lastMonthOrder,
      productCount,
      userCount,
      allOrders,
      sixMonthOrders,
      productCategories,
      femaleUsersCount,
      lastFiveOrders,
    ] = await Promise.all([
      thisMonthUsersPromise,
      lastMonthUsersPromise,
      thisMonthProductPromise,
      lastMonthProductPromise,
      thisMonthOrderPromise,
      lastMonthOrderPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find(),
      sixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      Order.find()
        .select(["total", "discount", "orderItems", "status"])
        .limit(4),
    ]);

    const thisMonthRevenue = thisMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercentage = {
      order: calculatePercentage(thisMonthUsers.length, lastMonthOrder.length),
      product: calculatePercentage(
        thisMonthProduct.length,
        lastMonthProduct.length
      ),
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const lastSixMonthOrders = new Array(6).fill(0);
    const lastSixMonthRevenue = new Array(6).fill(0);

    sixMonthOrders.forEach((order, index) => {
      const creationDate = new Date(order.createdAt);
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        lastSixMonthOrders[6 - monthDiff - 1] += 1;
        lastSixMonthRevenue[6 - monthDiff - 1] += order.total || 0;
      }
    });

    const categoryCount: Record<string, number>[] = [];

    const categoriesCountPromise = productCategories.map((category) =>
      Product.countDocuments({ category })
    );

    const categoriesCountData = await Promise.all(categoriesCountPromise);

    productCategories.forEach((category, index) => {
      categoryCount.push({
        [category]: (categoriesCountData[index] / productCount) * 100,
      });
    });

    const userRatio = {
      female: femaleUsersCount,
      male: userCount - femaleUsersCount,
    };

    const modifiedLastFiveOrders = lastFiveOrders.map((i) => {
      return {
        _id: i._id,
        total: i.total,
        discount: i.discount,
        orderItems: i.orderItems.length,
        status: i.status,
      };
    });

    const count = {
      order: allOrders.length,
      product: productCount,
      user: userCount,
      revenue,
    };

    stats = {
      changePercent: changePercentage,
      count,
      chart: {
        lastSixMonthOrders,
        lastSixMonthRevenue,
      },
      categories: categoryCount,
      userRatio,
      topTransactions: modifiedLastFiveOrders,
    };

    await setCache(key, stats);
  }

  return res.status(200).json({ success: true, stats });
});

export const getPieCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";

  charts = await getCache(key);
  if (!charts) {
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      outOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    const stockAvailablity = {
      inStock: productsCount - outOfStock,
      outOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts = {
      orderFullfillment,
      productCategories,
      stockAvailablity,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    await setCache(key, charts);
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getBarCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  charts = await getCache(key);
  if (!charts) {
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);

    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });

    charts = {
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
    };

    await setCache(key, charts);
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});

export const getLineCharts = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  charts = await getCache(key);
  if (!charts) {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    await setCache(key, charts);
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});
