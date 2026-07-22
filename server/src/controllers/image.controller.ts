import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

import {
  uploadSingleImage,
  uploadMultipleImages,
  getProductImages,
  setPrimaryImage,
  deleteImage,
} from "../services/image.service.js";

interface ProductParams {
  id: string;
}

interface ImageParams {
  imageId: string;
}

/**
 * Upload Single Image
 * POST /api/products/:id/images
 */
export const uploadOne = asyncHandler(
  async (req: Request<ProductParams>, res: Response) => {
    if (!req.file) {
      throw new AppError("Please upload an image", 400);
    }

    const image = await uploadSingleImage(req.params.id, req.file);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image,
    });
  }
);

/**
 * Upload Multiple Images
 * POST /api/products/:id/images/multiple
 */
export const uploadMany = asyncHandler(
  async (req: Request<ProductParams>, res: Response) => {
    if (!req.files || !Array.isArray(req.files)) {
      throw new AppError("Please upload images", 400);
    }

    const images = await uploadMultipleImages(
      req.params.id,
      req.files as Express.Multer.File[]
    );

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: images,
    });
  }
);

/**
 * Get Product Images
 * GET /api/products/:id/images
 */
export const getImages = asyncHandler(
  async (req: Request<ProductParams>, res: Response) => {
    const images = await getProductImages(req.params.id);

    res.status(200).json({
      success: true,
      data: images,
    });
  }
);

/**
 * Set Primary Image
 * PATCH /api/products/images/:imageId/primary
 */
export const makePrimary = asyncHandler(
  async (req: Request<ImageParams>, res: Response) => {
    const image = await setPrimaryImage(req.params.imageId);

    res.status(200).json({
      success: true,
      message: "Primary image updated successfully",
      data: image,
    });
  }
);

/**
 * Delete Image
 * DELETE /api/products/images/:imageId
 */
export const remove = asyncHandler(
  async (req: Request<ImageParams>, res: Response) => {
    const result = await deleteImage(req.params.imageId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);