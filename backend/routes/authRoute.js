import express from "express";
import {
  signUp,
  signIn,
  google,
  refreshToken,
  verifyEmail,
  signOut,
  sendVerificationOtp,
  makeVendor,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);
router.post("/google", google);
router.post("/refreshToken", refreshToken);
router.get("/verify-email", verifyEmail);
router.post("/send-otp", sendVerificationOtp);
router.post("/be-vendor", makeVendor);
// router.post("/verify-otp", sendVerificationOtp);

export default router;
