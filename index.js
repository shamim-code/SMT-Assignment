const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const createError = require("http-errors");
const cookieParser = require('cookie-parser');
const router = require("./route");

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// Routes 
app.use(router);

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Gym Management API" });
});

// Handle 404 errors
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
