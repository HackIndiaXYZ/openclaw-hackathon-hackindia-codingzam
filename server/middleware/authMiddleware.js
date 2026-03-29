const jwt = require("jsonwebtoken");

// Protect routes by validating JWT from Authorization header.
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not configured." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload to request for use in next handlers.
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
