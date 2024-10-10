import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { Controllertype } from "../types/types.js";
import { Document } from "mongoose";

export const errorMiddleWare = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.name === "MongoServerError") {
    err.message = "Duplicate key error";
  }
  if (err.name === "CastError") {
    err.message = "Invalid ID";
  }


  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

interface ExtendedRequest extends Request {
  user?: Document;
}
export const TryCatch =
  (func: Controllertype) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(func(req, res, next)).catch(next);
  };
