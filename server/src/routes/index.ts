import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import imageRoutes from "./image.routes.js";
import cartRoutes from "./cart.routes.js";
const router = Router();


router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/products", imageRoutes);
router.use("/cart", cartRoutes);

export default router;