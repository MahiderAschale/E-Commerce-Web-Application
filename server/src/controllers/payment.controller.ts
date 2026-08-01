import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  initializeChapaPayment,
  verifyChapaPayment,
} from "../services/payment.service.js";

import { initializePaymentSchema } from "../validators/payment.validator.js";

export const initialize = asyncHandler(
  async (req: Request, res: Response) => {
    const data = initializePaymentSchema.parse(req.body);

    const payment = await initializeChapaPayment(
      req.user!.userId,
      data.orderId
    );

    res.status(200).json({
      success: true,
      message: "Payment initialized successfully.",
      data: payment,
    });
  }
);

export const verify = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await verifyChapaPayment(Array.isArray(req.params.tx_ref) ? req.params.tx_ref[0] : req.params.tx_ref);

    res.status(200).json(result);
  }
);