import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { invalidateCache } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { getCache, setCache } from "../services/redis.js";

export const createCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    return next(new ErrorHandler("Please Enter Coupon Code & Amount", 400));

  const newCoupon = await Coupon.create({
    code: coupon,
    amount,
  });

  await invalidateCache({ coupons: true });

  return res.status(201).json({
    success: true,
    newCoupon,
  });
});

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const key = "all-coupons";
  let coupons = await getCache(key);

  if (!coupons) {
    coupons = await Coupon.find();
    await setCache(key, coupons);
  }

  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon Not Found", 404));
  }

  await invalidateCache({ coupons: true, couponID: id });

  return res.status(200).json({
    success: true,
    message: "Coupon Deleted Successfully",
  });
});

export const getDiscount = TryCatch(async (req, res, next) => {
  const { id } = req.query as { id: string };
  const key = `coupon-${id}`;

  let coupon = await getCache(key);
  if (!coupon) {
    coupon = await Coupon.findById(id);
    if (!coupon) return next(new ErrorHandler("Invalid Coupon", 400));
    await setCache(key, coupon);
  }

  return res.status(200).json({
    success: true,
    amount: coupon.amount,
  });
});
