import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cart.service.js";

import {
  addToCartSchema,
  updateCartSchema,
} from "../validators/cart.validator.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = addToCartSchema.parse(req.body);

  const cart = await addToCart(req.user!.userId, data);

  res.status(201).json({
    success: true,
    message: "Product added to cart",
    data: cart,
  });
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await getMyCart(req.user!.userId);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = updateCartSchema.parse(req.body);

  const cart = await updateCartItem(
    req.user!.userId,
    Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId,
    quantity
  );

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await removeCartItem(
    req.user!.userId,
    Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const clear = asyncHandler(async (req: Request, res: Response) => {
  const result = await clearCart(req.user!.userId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});