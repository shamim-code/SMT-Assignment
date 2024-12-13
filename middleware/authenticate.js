const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createError(401, "Authentication token missing or invalid");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user and attach to req.user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createError(401, "User not found");
    }

    req.user = { id: user._id, role: user.role, name: user.name, email: user.email };
    next(); 
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
