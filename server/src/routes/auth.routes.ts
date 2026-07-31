import { RequestHandler, Router } from "express";
import { register ,login  ,profile, logout, updateProfile} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, profile);
router.patch("/profile",protect, updateProfile as unknown as RequestHandler )

router.post("/logout", protect, logout);

export default router;