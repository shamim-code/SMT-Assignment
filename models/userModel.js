const mongoose = require("mongoose");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "trainer", "trainee"],
      required: true,
      default: "trainee",
    },
  },{timestamps: true,}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
