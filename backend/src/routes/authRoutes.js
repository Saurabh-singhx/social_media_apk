import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { otpVerify } from "../controllers/otp.controller.js";

const router = express.Router();

router.post("/otp",otpVerify);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check",protectRoute,checkAuth);
router.put("/update-profile",protectRoute,updateProfile);


export default router;