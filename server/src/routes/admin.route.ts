import { Router } from "express";
import { Role } from "@prisma/client";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { getDashboard } from "../controllers/admin.controller.js";

const router = Router();

router.use(protect);
router.use(authorize(Role.ADMIN));

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Admin access confirmed",
    user: req.user,
  });
});

router.get("/dashboard", getDashboard);

export default router;