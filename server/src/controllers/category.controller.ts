import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

interface IdParams {
  id: string;
}

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createCategorySchema.parse(req.body);

  const category = await createCategory(data);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await getCategories();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getOne = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const category = await getCategoryById(req.params.id);

    res.status(200).json({
      success: true,
      data: category,
    });
  }
);

export const update = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    const data = updateCategorySchema.parse(req.body);

    const category = await updateCategory(req.params.id, data);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  }
);

export const remove = asyncHandler(
  async (req: Request<IdParams>, res: Response) => {
    await deleteCategory(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);