import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  checkout,
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../services/order.service.js";

import {
  checkoutSchema,
  placeOrderSchema,
} from "../validators/order.validator.js";

export const checkoutOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = checkoutSchema.parse(req.body);

  const summary = await checkout(req.user!.userId, data);

  res.status(200).json({
    success: true,
    data: summary,
  });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = placeOrderSchema.parse(req.body);

  const order = await placeOrder(req.user!.userId, data);

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getMyOrders(req.user!.userId);

  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrderById(
    req.user!.userId,
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  );

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const order = await cancelOrder(
    req.user!.userId,
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});