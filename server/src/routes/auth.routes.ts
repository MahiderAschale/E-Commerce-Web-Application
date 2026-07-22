import { Router } from "express";
import { register ,login  ,profile, logout} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", protect, profile);

router.post("/logout", protect, logout);

export default router;