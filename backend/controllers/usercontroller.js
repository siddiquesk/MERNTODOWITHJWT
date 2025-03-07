import User from '../models/user-model.js';
import bcrypt from "bcrypt";
import { z } from "zod";
import { generateToken } from "../jwt/token.js";

// Define validation schema using Zod for user registration
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  password: z.string().min(6, { message: "Password must be between 6 and 14 characters" }).max(14),
});

/**
 * User Registration Controller
 * 1. Validates user input using Zod schema.
 * 2. Checks if the email already exists in the database.
 * 3. Hashes the password for security.
 * 4. Saves the new user to the database.
 * 5. Generates a JWT token upon successful registration.
 */
export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if all required fields are provided
    if (!email || !username || !password) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    // Validate input using Zod schema
    const validation = userSchema.safeParse({ email, username, password });
    if (!validation.success) {
      const errMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errMessage });
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already registered" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save it to the database
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate JWT token for the new user
    if (newUser) {
      const token = await generateToken(newUser._id, res);
      return res.status(200).json({ message: "User created successfully", newUser, token });
    }
  } catch (err) {
    res.status(500).json({ message: `Error occurred: ${err.message}` });
  }
};

/**
 * User Login Controller
 * 1. Validates input fields.
 * 2. Checks if the user exists in the database.
 * 3. Verifies password using bcrypt.
 * 4. Generates a JWT token upon successful login.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({errors: "All fields are required" });
    }

    // Find user by email and include password field for verification
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ errors: "Invalid email or password" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token upon successful login
    const token = await generateToken(user._id, res);
    res.status(200).json({ message: "User login successful", user, token });
  } catch (err) {
    res.status(500).json({ message: `Error occurred: ${err.message}` });
  }
};

/**
 * User Logout Controller
 * 1. Clears the authentication token (JWT) stored in cookies.
 * 2. Sends a success response after logging out the user.
 */
export const logout = async (req, res) => {
  try {
    // Clear the JWT token stored in cookies
    res.clearCookie("jwt", { path: "/" });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: `Error occurred: ${err.message}` });
  }
};
