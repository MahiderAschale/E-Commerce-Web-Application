import { Router } from "express";

import {
  initialize,
  verify,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Buyer initializes payment
router.post(
  "/chapa/initialize",
  protect,
  initialize
);

// Verify payment
router.get(
  "/chapa/verify/:tx_ref",
  verify
);

export default router;