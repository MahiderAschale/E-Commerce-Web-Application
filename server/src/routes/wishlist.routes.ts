import { Router } from "express";
import { Role } from "@prisma/client";

import {
  add,
  getAll,
  remove,
} from "../controllers/wishlist.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(protect);
router.use(authorize(Role.BUYER));

router.post("/", add);

router.get("/", getAll);

router.delete("/:productId", remove);

export default router;