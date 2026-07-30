import { Router } from "express";
import { Role } from "@prisma/client";

import {
  getAll,
  getOne,
  updateStatus,
} from "../controllers/adminOrder.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

// Every route requires ADMIN
router.use(protect);
router.use(authorize(Role.ADMIN));

// GET /api/admin/orders
router.get("/", getAll);

// GET /api/admin/orders/:id
router.get("/:id", getOne);

// PATCH /api/admin/orders/:id/status
router.patch("/:id/status", updateStatus);

export default router;