import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getDashboardStats } from "../services/admin.service.js";

export const getDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    const stats = await getDashboardStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);