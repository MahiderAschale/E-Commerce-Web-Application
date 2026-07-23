import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getCart,
  update,
  remove,
  clear,
} from "../controllers/cart.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.use(protect);
router.use(authorize(Role.BUYER));

router.post("/", create);

router.get("/", getCart);

router.patch("/:itemId", update);

router.delete("/:itemId", remove);

router.delete("/", clear);

export default router;