import { Request, Response } from "express";
import { registerUser } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginUser } from "../services/auth.service.js";
import { getProfile } from "../services/auth.service.js";
import { logoutUser } from "../services/auth.service.js";
import {updateProfile as updateProfileService,} from "../services/auth.service.js";
import {updateProfileSchema} from "../validators/auth.validator.js"

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(
    req.body.fullName,
    req.body.email,
    req.body.password
  );

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(
    req.body.email,
    req.body.password
  );

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const profile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user!.userId);

  res.json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const body = updateProfileSchema.parse(req.body);

  const user = await updateProfileService(
    String(req.user!.id),
    body
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: user,
  });
});

export const logout = asyncHandler(async (_req, res) => {
  const result = await logoutUser();

  res.status(200).json({
    success: true,
    message: result.message,
  });
});