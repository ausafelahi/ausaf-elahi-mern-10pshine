const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
} = require("../controllers/authController");
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

router.post("/register", validateRegistration, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

const authRoutes = router;
module.exports = authRoutes;
