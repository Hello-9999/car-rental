import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";
import pool from "../db.js";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import twilio from "twilio";

import * as admin from "firebase-admin"; // Correct way to import Admin SDK
import { rm } from "fs";

// import "firebase/auth";

const expireDate = new Date(Date.now() + 3600000);

// Regex for email and password validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const twilioAccountSid = process.env.VITE_TWILLO_ACCOUNT_SID;
const twilioAuthToken = process.env.VITE_TWILLO_AUTH_Token;
const twilioPhoneNumber = process.env.VITE_TWILLO_PHONE_NUMBER;
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// genereate Access Token

function generateAccessToken(user) {
  const payload = { id: user.id, email: user.email, username: user.username };
  return Jwt.sign(payload, process.env.VITE_ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

function generateRefreshToken(user) {
  const payload = { id: user.id, email: user.email, username: user.username };

  return Jwt.sign(payload, process.env.VITE_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}
// Generate a random 6-digit OTP
const generateOTP = (length = 6) => {
  const characters = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
};

export const signUp = async (req, res, next) => {
  const {
    username,
    email,
    password,
    phoneNumber,
    adress,
    isUser,
    isAdmin,
    isVendor,
  } = req.body;

  const profilePicture =
    "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=";

  try {
    // 1. Input validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ status: false, msg: "All fields are required" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ status: false, msg: "Username must be at least 3 characters" });
    }
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ status: false, msg: "Invalid email format" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: false,
        msg: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
      });
    }
    // 2. Uniqueness check
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ msg: "Email or username already in use" });
    }

    // 3. Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // 4. Generate verification token
    const verificationToken = uuidv4();

    // 5. Insert user with verification fields
    const sql = `
      INSERT INTO users 
      (username, email, password, phoneNumber, adress, profilePicture, isUser, isAdmin, isVendor, isVerified, verificationToken) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      username,
      email,
      hashedPassword,
      phoneNumber ?? null,
      adress ?? null,
      profilePicture,
      isUser ?? true,
      isAdmin ?? false,
      isVendor ?? false,
      false, // isVerified
      verificationToken,
    ]);

    // 6. Send verification email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail app password
      },
    });

    const verifyUrl = `${
      process.env.VITE_FRONTEND_URL
    }/verify-email?token=${verificationToken}&email=${encodeURIComponent(
      email
    )}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`,
    });

    res.status(201).json({
      status: true,
      msg: "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    // Handle duplicate email/user errors etc.
    console.log(error);
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token, email } = req.query;
  try {
    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND verificationToken = ?",
      [email, token]
    );
    if (users.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid or expired verification link." });
    }
    await pool.query(
      "UPDATE users SET isVerified = true, verificationToken = NULL WHERE email = ?",
      [email]
    );
    res
      .status(200)
      .json({ success: true, msg: "Email verified successfully!" });
  } catch (error) {
    console.log(error, "err");
    next(error);
  }
};

export const sendVerificationOtp = async (req, res, next) => {
  const { clientNumber, email } = req.body;
  const otp = generateOTP(6); // Generate a 6-digit OTP
  const messageBody = `Your verification code is: ${otp}\n\nUse this code to verify your phone number.\n\nIf you did not request this, please ignore this message.`;

  if (!clientNumber || !email) {
    res.status(401).json({
      msg: "Send a  required data  ",
      status: false,
    });
  }
  try {
    // Query to find the user by email
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // If no phone number exists for this user, update the phone number and OTP in the database
    if (rows.phoneNumber == null) {
      await pool.query(
        "UPDATE users SET phoneNumber = ?, phoneNumberVerificationToken = ? WHERE email = ?",
        [clientNumber, otp, email] // Store the phone number and OTP for later verification
      );
    } else {
      // Update only the OTP if the phone number is already stored
      await pool.query(
        "UPDATE users SET phoneNumberVerificationToken = ? WHERE email = ?",
        [otp, email]
      );
    }

    // Send OTP to the user's phone number via Twilio
    await twilioClient.messages.create({
      body: messageBody,
      from: twilioPhoneNumber, // Your Twilio phone number
      to: clientNumber, // The user's phone number
    });

    // Send success response to the client
    res.status(200).json({
      msg: "OTP Sent Successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);

    // Send error response if something went wrong
    return res.status(400).json({
      error: error.message,
      status: false,
      msg: "Failed to send OTP",
      errorObj: error,
    });
  }
};

export const verifyOtp = async (code) => {
  const confirmationResult = req.session.confirmationResult; // Or get it from your session
  try {
    const result = await confirmationResult.confirm(code);
    const user = result.user; // This is the authenticated user
    console.log("Phone number verified successfully!", user);
    // Continue with user registration or other actions here
  } catch (error) {
    console.error("Error verifying OTP", error);
    // Handle error, possibly show an error message to the user
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const validUser = rows[0];

    // 2. Check if user exists
    if (!validUser) {
      return res
        .status(400)
        .json({ status: false, msg: "User with this email does not exist." });
    }

    // 3. Check if user is verified
    if (!validUser.isVerified) {
      return res.status(403).json({
        status: false,
        msg: "Account not verified. Please check your email to verify your account.",
      });
    }

    // 4. Check password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ status: false, msg: "Wrong credentials" });
    }

    // 5. Generate tokens
    const accessToken = generateAccessToken(validUser);
    const refreshToken = generateRefreshToken(validUser);
    console.log({ accessToken: accessToken, refreshToken: refreshToken });

    // 6. Save refresh token in DB
    await pool.query("UPDATE users SET refreshToken = ? WHERE id = ?", [
      refreshToken,
      validUser.id,
    ]);

    // 7. Send refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8. Remove sensitive data before sending user info
    const {
      password: _,
      refreshToken: dbToken,
      ...userWithoutPassword
    } = validUser;

    // ✅ Send final response
    return res.status(200).json({
      accessToken,
      refreshToken,
      ...userWithoutPassword,
      success: true,
      msg: "Login successful",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  const token = req.cookies;
  console.log(token, "token");
  res.clearCookie("refreshToken").json({ msg: "Logged out" });
};
//refreshTokens
export const refreshToken = async (req, res, next) => {
  try {
    // 🔹 Get refresh token from cookie OR header
    const token =
      req.cookies.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(errorHandler(403, "No refresh token provided"));
    }

    // 🔹 Verify refresh token
    const decoded = Jwt.verify(token, process.env.VITE_REFRESH_TOKEN_SECRET);

    // 🔹 Get user by ID from MySQL
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);
    const user = rows[0];

    if (!user) return next(errorHandler(403, "User not found"));

    // 🔹 Check if refresh token matches DB
    if (user.refreshToken !== token) {
      return next(errorHandler(403, "Refresh token mismatch"));
    }

    // 🔹 Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // 🔹 Update refresh token in DB
    await pool.query("UPDATE users SET refreshToken = ? WHERE id = ?", [
      newRefreshToken,
      user.id,
    ]);

    // 🔹 Send new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ Send back new access token (frontend will replace old one)
    res.status(200).json({
      accessToken: newAccessToken,
      success: true,
      msg: "Token refreshed successfully",
    });
  } catch (err) {
    console.log(err);
    return next(errorHandler(403, "Invalid refresh token"));
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (user && !user.isUser) {
      return next(errorHandler(409, "email already in use as a vendor"));
    }
    if (user) {
      const { password: hashedPassword, ...rest } = user;
      const token = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
          SameSite: "None",
          Domain: ".vercel.app",
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //we are generating a random password since there is no password in result
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        profilePicture: req.body.photo,
        password: hashedPassword,
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        isUser: true,
        //we cannot set username to req.body.name because other user may also have same name so we generate a random value and concat it to name
        //36 in toString(36) means random value from 0-9 and a-z
      });
      const savedUser = await newUser.save();
      const userObject = savedUser.toObject();

      const token = Jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN);
      const { password: hashedPassword2, ...rest } = userObject;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
          sameSite: "None",
          secure: true,
          domain: ".vercel.app",
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const makeVendor = async (req, res, next) => {
  const { id } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const [result] = await pool.execute(
      "UPDATE users SET isVendor = ? WHERE id = ?",
      [1, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Fetch the updated user details
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);

    res
      .status(200)
      .json({ success: true, message: "User marked as vendor", data: rows[0] });
  } catch (error) {
    next(error);
  }
};
