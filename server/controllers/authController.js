import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplate.js";
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing details",
    });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User already Exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ name, email, password: hashedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending welcome email
    const mailOptions = {
      from: "niteshshivhare321@gmail.com",
      to: email,
      subject: "WELCOME TO AUTH VALIDATION",
      text: "Welcome to auth validation your account has been created with email",
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "User ragistraion succesfully ",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid Email",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User login ",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "error while login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "errro in logout",
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "User already verified",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;

    user.verifyOtpExpireAt = Date.now() + 25 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      // text: `Your OTP is ${otp} . Verify your account using this otp`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Verification mail send successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing details",
    });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid otp",
      });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "Out Expired",
      });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfull",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// send password reset\

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;

    user.resetOtpExpireAt = Date.now() + 15 * 60 * 60 * 1000;
    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset OTP",
      text: `Your otp for reseting your password is ${otp} use thi otp to proceed with reseeting your password`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);
    return res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;
  const user = await userModel.find({ email });
  console.log("Otp", otp, email);
  if (!otp) {
    return res.status(201).json({
      success: true,
      message: "Otp is not found",
    });
  }

  if (otp == user.verifyOtp) {
    user.verifyOtp = 0;

    return res.json({
      success: true,
      message: "otp is verify",
    });
  }
  return res.json({
    success: false,
    message: "Otp Not match",
  });
};
//  Reset user Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, otp and nepassword are required",
    });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "Otp expires",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({
      success: true,
      message: "Password has reset succesfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error while reseting password",
    });
  }
};
