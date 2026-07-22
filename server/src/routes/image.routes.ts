import { Router } from "express";
import { Role } from "@prisma/client";

import {
  uploadOne,
  uploadMany,
  getImages,
  makePrimary,
  remove,
} from "../controllers/image.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

/**
 * Public
 * GET /api/products/:id/images
 */
router.get(
  "/:id/images",
  getImages
);


router.post(
  "/:id/images",
  protect,
  authorize(Role.ADMIN),
  upload.single("image"),
  uploadOne as unknown as import("express-serve-static-core").RequestHandler
);

/**
 * Admin
 * POST /api/products/:id/images/multiple
 */
router.post(
  "/:id/images/multiple",
  protect,
  authorize(Role.ADMIN),
  upload.array("images", 10),
  uploadMany as unknown as import("express-serve-static-core").RequestHandler
);

/**
 * Admin
 * PATCH /api/products/images/:imageId/primary
 */
router.patch(
  "/images/:imageId/primary",
  protect,
  authorize(Role.ADMIN),
  makePrimary as unknown as import("express-serve-static-core").RequestHandler
);

/**
 * Admin
 * DELETE /api/products/images/:imageId
 */
router.delete(
  "/images/:imageId",
  protect,
  authorize(Role.ADMIN),
  remove as unknown as import("express-serve-static-core").RequestHandler
);

export default router;