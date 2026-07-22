import { Router } from "express";
import { Role } from "@prisma/client";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = Router();

router.get(
  "/admin",
  protect,
  authorize(Role.ADMIN),
  (_req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin!"
    });
  }
);

export default router;