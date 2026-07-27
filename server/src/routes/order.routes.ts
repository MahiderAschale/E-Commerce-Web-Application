import { Router } from "express";
import { Role } from "@prisma/client";

import {
  checkoutOrder,
  createOrder,
  getOrders,
  getOrder,
  cancel,
} from "../controllers/order.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(protect);
router.use(authorize(Role.BUYER));

// Checkout summary
router.post("/checkout", checkoutOrder);

// Finalize order
router.post("/", createOrder);

// Buyer's orders
router.get("/", getOrders);

router.get("/:id", getOrder);

// Cancel pending order
router.patch("/:id/cancel", cancel);

export default router;