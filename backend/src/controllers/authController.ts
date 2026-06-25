import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password) {
      return res.status(401).json({ message: "Please use Google login" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: "Google sign-in successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
