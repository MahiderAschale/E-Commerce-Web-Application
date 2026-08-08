import { Router } from "express";

import {
  initialize,
  verify,
  status,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/chapa/initialize",
  protect,
  initialize
);

router.get(
  "/chapa/status/:tx_ref",
  protect,
  status
);

router.get(
  "/chapa/verify/:tx_ref",
  verify
);

export default router;