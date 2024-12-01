import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const user = await User.findOne({ email }); //validate unique user

    if (user) {
      res.status(401).json({ message: "User already exists", success: false });
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const savedUser = await User.create({
        username: username,
        password: hashed,
        email: email,
      });
      const token = jwt.sign({ username, email }, process.env.JWT_SECRET);
      res
        .status(200)
        .json({ message: "User created", success: true, data: { token } });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error signing up",
      success: false,
      error: err,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "User does not exist", success: false });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({ username, email }, process.env.JWT_SECRET);
        res
          .status(200)
          .json({ message: "User logged in", success: true, data: { token } });
      } else {
        res
          .status(401)
          .json({ message: "Invalid credentials", success: false });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Error logging in",
      success: false,
      error: err,
    });
  }
};