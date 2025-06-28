import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";
import pool from "../db.js";
const expireDate = new Date(Date.now() + 3600000);

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
  console.log(username, email, password, "name");
  const profilePicture =
    "https://media.istockphoto.com/id/1316420668/vector/user-icon-human-person-symbol-social-profile-icon-avatar-login-sign-web-user-symbol.jpg?s=612x612&w=0&k=20&c=AhqW2ssX8EeI2IYFm6-ASQ7rfeBWfrFFV4E87SaFhJE=";
  try {
    // Validate input manually if needed
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Insert into MySQL
    const sql = `
      INSERT INTO users 
      (username, email, password, phoneNumber, adress, profilePicture, isUser, isAdmin, isVendor) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle duplicate email/user errors etc.
    console.log(error);
    next(error);
  }
};

//refreshTokens
export const refreshToken = async (req, res, next) => {
  // const refreshToken = req.cookies.refresh_token;

  if (!req.headers.authorization) {
    return next(errorHandler(403, "bad request no header provided"));
  }

  const refreshToken = req.headers.authorization.split(" ")[1].split(",")[0];
  const accessToken = req.headers.authorization.split(" ")[1].split(",")[1];

  console.log(refreshToken);
  console.log(accessToken);

  if (!refreshToken) {
    // res.clearCookie("access_token", "refresh_token");
    return next(errorHandler(401, "You are not authenticated"));
  }

  try {
    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    // Get user by ID
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      decoded.id,
    ]);
    const user = rows[0];

    if (!user) return next(errorHandler(403, "Invalid refresh token"));

    if (user.refreshToken !== refreshToken) {
      return next(errorHandler(403, "Refresh token mismatch"));
    }

    // Generate new tokens
    const newAccessToken = Jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
    });

    const newRefreshToken = Jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // Update refresh token in MySQL
    await pool.query("UPDATE users SET refreshToken = ? WHERE id = ?", [
      newRefreshToken,
      user.id,
    ]);

    // Send tokens in cookies
    res
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: "None",
        secure: true,
        // domain: "rent-a-ride-two.vercel.app",
      })
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: "None",
        secure: true,
        // domain: "rent-a-ride-two.vercel.app",
      })
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(errorHandler(500, "error in refreshToken controller in server"));
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
    if (!validUser) return next(errorHandler(404, "User not found"));

    // 2. Check password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    // 3. Generate tokens
    const accessToken = Jwt.sign(
      { id: validUser.id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = Jwt.sign(
      { id: validUser.id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    // 4. Update refreshToken in DB
    await pool.query("UPDATE users SET refreshToken = ? WHERE id = ?", [
      refreshToken,
      validUser.id,
    ]);

    // 5. Prepare response without password
    const {
      password: _,
      refreshToken: dbToken,
      ...userWithoutPassword
    } = validUser;

    // 6. Send response
    res.status(200).json({
      accessToken,
      refreshToken,
      ...userWithoutPassword,
      succes: true,
    });

    next();
  } catch (error) {
    next(error);
    console.log(error);
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
