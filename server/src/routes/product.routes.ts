import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/product.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

/* ======================================
   Public Routes
====================================== */

router.get("/", getAll);
router.get("/:id", getOne);

/* ======================================
   Protected Admin Routes
====================================== */

router.use(protect);
router.use(authorize(Role.ADMIN));

router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;