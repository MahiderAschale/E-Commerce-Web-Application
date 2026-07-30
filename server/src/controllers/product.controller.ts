import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";
import { productSearchSchema } from "../validators/productSearch.validator.js";

interface IdParams {
  id: string;
}

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);

  const product = await createProduct(data);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const query = productSearchSchema.parse(req.query);

  const products = await getProducts(query);

  res.status(200).json({
    success: true,
    data: products,
  });
});

export const getOne = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const product = await getProductById(req.params.id);

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

export const update = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const data = updateProductSchema.parse(req.body);

    const product = await updateProduct(req.params.id, data);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  }
);

export const remove = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    await deleteProduct(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  }
);