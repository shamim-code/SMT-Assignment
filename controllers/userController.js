const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");

// Create a new trainer
exports.createTrainer = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createError(400, "All fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const trainer = new User({
      name,
      email,
      password: hashedPassword,
      role: "trainer",
    });

    await trainer.save();
    res.status(201).json({ message: "Trainer created successfully", trainer });
  } catch (error) {
    next(error);
  }
};

// Update a trainer
exports.updateTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trainer = await User.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!trainer || trainer.role !== "trainer") {
      throw createError(404, "Trainer not found");
    }

    res.status(200).json({ message: "Trainer updated successfully", trainer });
  } catch (error) {
    next(error);
  }
};

// Delete a trainer
exports.deleteTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainer = await User.findByIdAndDelete(id);

    if (!trainer || trainer.role !== "trainer") {
      throw createError(404, "Trainer not found");
    }

    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Register a new trainee
exports.registerTrainee = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw createError(400, "All fields are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const trainee = new User({
      name,
      email,
      password: hashedPassword,
      role: "trainee",
    });

    await trainee.save();
    res.status(201).json({ message: "Trainee registered successfully", trainee });
  } catch (error) {
    next(error);
  }
};

// Update a trainee
exports.updateTrainee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const trainee = await User.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!trainee || trainee.role !== "trainee") {
      throw createError(404, "Trainee not found");
    }

    res.status(200).json({ message: "Trainee updated successfully", trainee });
  } catch (error) {
    next(error);
  }
};

// Delete a trainee
exports.deleteTrainee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainee = await User.findByIdAndDelete(id);

    if (!trainee || trainee.role !== "trainee") {
      throw createError(404, "Trainee not found");
    }

    res.status(200).json({ message: "Trainee deleted successfully" });
  } catch (error) {
    next(error);
  }
};

//login user
exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        throw createError(400, "Email and password are required");
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        throw createError(401, "Invalid email or password");
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw createError(401, "Invalid email or password");
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.cookie("token", token).status(200).json({
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  };
