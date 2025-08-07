import express from "express"
import { checkAuth, googleSignUp, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { otpVerify } from "../controllers/otp.controller.js";
import passport from "passport";

const router = express.Router();

router.post("/otp",otpVerify);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check",protectRoute,checkAuth);
router.put("/update-profile",protectRoute,updateProfile);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",passport.authenticate("google", { failureRedirect: "/login" }),googleSignUp)


export default router;