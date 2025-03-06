import jwt from "jsonwebtoken";
import User from "../models/user-model.js";

/**
 * Function to generate a JWT token for user authentication.
 * 1. Signs a JWT token with the userId as the payload.
 * 2. Uses the secret key stored in environment variables for encryption.
 * 3. Sets the token expiration time to 10 days.
 * 4. Stores the token in an HTTP-only cookie for security.
 * 5. Updates the user's record in the database with the generated token.
 * 6. Returns the generated token.
 */
export const generateToken = async (userId, res) => {
  // Create a JWT token with user ID as payload and a 10-day expiration
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  // Store the token in a cookie with security settings
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false,  // Should be set to true in production for HTTPS
    sameSite: "lax", // Prevents CSRF attacks while allowing cross-site requests
    path: "/", // The cookie is available on all routes
  });

  // Save the token in the user's record in the database
  await User.findByIdAndUpdate(userId, { token });

  return token; // Return the generated JWT token
};
