import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/address.service.js";

import {
  createAddressSchema,
  updateAddressSchema,
} from "../validators/address.validator.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = createAddressSchema.parse(req.body);

  const address = await createAddress(req.user!.userId, data);

  res.status(201).json({
    success: true,
    message: "Address created successfully",
    data: address,
  });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await getAddresses(req.user!.userId);

  res.status(200).json({
    success: true,
    data: addresses,
  });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const address = await getAddress(
    req.user!.userId,
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  );

  res.status(200).json({
    success: true,
    data: address,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = updateAddressSchema.parse(req.body);

  const address = await updateAddress(
    req.user!.userId,
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    data
  );

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: address,
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const result = await deleteAddress(
    req.user!.userId,
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const makeDefault = asyncHandler(async (req: Request, res: Response) => {
  const address = await setDefaultAddress(
    req.user!.userId,
    Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    data: address,
  });
});