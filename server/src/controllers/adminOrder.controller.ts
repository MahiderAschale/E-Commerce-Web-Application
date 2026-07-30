import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  getAllOrders,
  getOrder,
  updateOrderStatus,
} from "../services/adminOrder.service.js";

import { updateOrderStatusSchema } from "../validators/adminOrder.validator.js";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const orders = await getAllOrders();

  res.status(200).json({
    success: true,
    data: orders,
  });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const order = await getOrder(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const updateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const data = updateOrderStatusSchema.parse(req.body);

    const order = await updateOrderStatus(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
      data
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  }
);