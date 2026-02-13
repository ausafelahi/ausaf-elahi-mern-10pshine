const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const { validationResult } = require("express-validator");
const Token = require("../models/Token");

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.log.warn(
        { errors: errors.array() },
        "Validation errors during registration",
      );
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      req.log.warn(`Registration attempt with existing email: ${email}`);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      req.log.warn(`User registered successfully: ${email}`);
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      });
    } else {
      req.log.error("User registration failed");
      res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }
  } catch (error) {
    req.log.error(`Registration error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.log.warn({ errors: errors.array() }, "Validation errors in login");
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      req.log.warn(`Login attempt with non-existent email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      req.log.warn(`Invalid password attempt for email: ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    req.log.info(`User logged in successfully: ${user.email}`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    req.log.error(`Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const decoded = jwt.decode(req.token);

    await Token.create({
      token: req.token,
      user: req.user._id,
      expiresAt: new Date(decoded.exp * 1000),
    });

    req.log.info(`User logged out: ${req.user.email}`);

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    req.log.error(`Logout error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    req.log.info(`User profile accessed: ${user.email}`);

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    req.log.error(`Get profile error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
