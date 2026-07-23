import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  makeDefault,
} from "../controllers/address.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { Role } from "@prisma/client";

const router = Router();

// All address routes require a logged-in buyer
router.use(protect);
router.use(authorize(Role.BUYER));

router.post("/", create);

router.get("/", getAll);

router.get("/:id", getOne);

router.patch("/:id", update);

router.delete("/:id", remove);

router.patch("/:id/default", makeDefault);

export default router;