import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import imageRoutes from "./image.routes.js";
import cartRoutes from "./cart.routes.js";
import addressRoutes from "./address.routes.js";
import orderRoutes from "./order.routes.js";
//import adminOrderRoutes from "./adminOrder.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import paymentRoutes from "./payment.routes.js";
import adminRoutes from "./admin.route.js";
const router = Router();



router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/products", imageRoutes);
router.use("/cart", cartRoutes);
router.use("/address", addressRoutes);
router.use("/orders", orderRoutes);
//router.use("/admin/orders", adminOrderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);
export default router;