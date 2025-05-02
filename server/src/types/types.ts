import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export interface NewUserRequestBody {
  name: string;
  email: string;
  password: string;
  photo: string;
  gender: string;
  dob: Date;
  age: number;
}

export interface NewProductRequestBody {
  name: string;
  price: number;
  category: string;
  stock: number;
}

export interface ExtendedRequest<TRequest, TBody, TParams>
  extends Request<TRequest, TBody, TParams> {
  user?: Document;
}

interface ControllertypeExtendedRequest extends Request {
  user?: Document;
}

export type Controllertype = (
  req: ControllertypeExtendedRequest,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export interface SearchQuery {
  query?: string;
  price?: string;
  category?: string;
  page?: string;
  sort?: string;
}

export type BaseQuery = {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
};

export type InvalidateCacheType = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  orderID?: string;
  productIDs?: string | string[];
  userID?: string;
  coupons?: boolean;
  couponID?: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export type OrderItemsType = {
  name: string;
  price: number;
  photo: string;
  quantity: number;
  productId: string;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemsType[];
}

export type CheckCacheType = {
  key: string;
  model: any;
  action: string;
  id?: string;
};

export type SendTokenFuncType = {
  user: Object;
  statusCode: number;
  res: Response;
};
