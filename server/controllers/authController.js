const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign(  // Generate JWT token with user ID and mode as payload.  // jwt.sign meanse that we are generating a JWT token
    {
      userId: user._id,
      mode: user.mode,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Register a new user account.
const signup = async (req, res) => {
  try {
    const { name, email, password, mode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists.",
      });
    }

    // Hash password before saving to keep user credentials secure.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      mode,
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "Signup successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mode: user.mode,
      },
    });
  } catch (error) {
    const isProd = process.env.NODE_ENV === "production";
    return res.status(500).json({
      message: "Signup failed.",
      ...(isProd ? {} : { error: error.message }),
    });
  }
};

// Authenticate existing user and return a JWT token.
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Password is excluded by default, so we explicitly select it here.
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mode: user.mode,
      },
    });
  } catch (error) {
    const isProd = process.env.NODE_ENV === "production";
    return res.status(500).json({
      message: "Login failed.",
      ...(isProd ? {} : { error: error.message }),
    });
  }
};

// Return current user profile for authenticated requests.
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile fetched successfully.",
      user,
    });
  } catch (error) {
    const isProd = process.env.NODE_ENV === "production";
    return res.status(500).json({
      message: "Failed to fetch profile.",
      ...(isProd ? {} : { error: error.message }),
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
};
