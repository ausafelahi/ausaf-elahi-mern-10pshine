const User = require("../models/User");
const OTP = require("../models/OTP");
const { validationResult } = require("express-validator");
const {
  generateOTP,
  sendPasswordResetOTP,
  sendPasswordResetConfirmation,
} = require("../services/emailService");
const hashedOTP = require("../utils/hashOTP");

const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, you will receive an OTP.",
      });
    }

    await OTP.deleteMany({ email, purpose: "password_reset" });

    const otp = generateOTP();

    await OTP.create({
      email,
      otp: hashedOTP(otp),
      purpose: "password_reset",
    });

    await sendPasswordResetOTP(email, otp, user.name);

    res.json({
      success: true,
      message: "OTP has been sent to your email. It will expire in 10 minutes.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp: hashedOTP(otp),
      purpose: "password_reset",
      verified: false,
    });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    otpRecord.verified = true;
    otpRecord.attempts += 1;
    await otpRecord.save();

    res.json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    const otpRecord = await OTP.findOne({
      email,
      otp: hashedOTP(otp),
      purpose: "password_reset",
      verified: true,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unverified OTP.",
      });
    }

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    await OTP.deleteOne({ _id: otpRecord._id });

    await sendPasswordResetConfirmation(email, user.name);

    res.json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: true,
        message:
          "If an account exists with this email, you will receive an OTP.",
      });
    }

    await OTP.deleteMany({ email, purpose: "password_reset" });

    const otp = generateOTP();

    await OTP.create({
      email,
      otp: hashedOTP(otp),
      purpose: "password_reset",
    });

    await sendPasswordResetOTP(email, otp, user.name);

    res.json({
      success: true,
      message: "New OTP has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP,
};
