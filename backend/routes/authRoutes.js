const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");
const {
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
} = require("../controllers/passwordResetController");
const { protect } = require("../middleware/auth");

const validateRegistration = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
];

const verifyOTPValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];

const resetPasswordValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
  body("newPassword")
    .trim()
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
];

router.post("/register", validateRegistration, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.post("/verify-otp", verifyOTPValidation, verifyOTP);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.post("/resend-otp", forgotPasswordValidation, resendOTP);

const authRoutes = router;
module.exports = authRoutes;
