import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlist.service.js";

import { addWishlistSchema } from "../validators/wishlist.validator.js";

export const add = asyncHandler(async (req: Request, res: Response) => {
  const data = addWishlistSchema.parse(req.body);

  const wishlist = await addToWishlist(
    req.user!.userId,
    data
  );

  res.status(201).json({
    success: true,
    message: "Product added to wishlist.",
    data: wishlist,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await getWishlist(req.user!.userId);

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await removeFromWishlist(
    req.user!.userId,
    Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});