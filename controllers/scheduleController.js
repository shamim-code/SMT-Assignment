const Schedule = require("../models/scheduleModel");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const createError = require("http-errors");

// Create a new schedule (Admin only)
exports.createSchedule = async (req, res, next) => {
    try {
      const { date, timeSlot, trainerId } = req.body;
  
      if (!date || !timeSlot || !trainerId) {
        throw createError(400, "Date, time slot, and trainer ID are required");
      }

      const cookieData = req.cookies;
      const userData = jwt.verify(cookieData.token, process.env.JWT_SECRET)
  
      // Check if the user is an admin
      if (userData.role !== "admin") {
        throw createError(403, "Access denied. Only admins can create schedules.");
      }
  
      // Count existing schedules for the given date
      const scheduleCount = await Schedule.countDocuments({ date });
      if (scheduleCount >= 5) {
        throw createError(400, "Maximum of 5 schedules can be created per day.");
      }
  
      // Check if the trainer exists
      const trainer = await User.findById(trainerId);
      if (!trainer || trainer.role !== "trainer") {
        throw createError(404, "Trainer not found");
      }
  
      // Create the new schedule
      const schedule = new Schedule({
        date,
        timeSlot,
        trainer: trainerId,
      });
  
      await schedule.save();
      res.status(201).json({ message: "Schedule created successfully", schedule });
    } catch (error) {
      next(error);
    }
  };
  
  // Book a schedule (Trainee only)
  exports.bookSchedule = async (req, res, next) => {
    try {
      const { scheduleId } = req.body;
  
      if (!scheduleId) {
        throw createError(400, "Schedule ID is required");
      }
  
      // Check if the user is a trainee
      if (req.user.role !== "trainee") {
        throw createError(403, "Access denied. Only trainees can book schedules.");
      }
  
      // Find the schedule
      const schedule = await Schedule.findById(scheduleId);
      if (!schedule) {
        throw createError(404, "Schedule not found");
      }
  
      // Check if the schedule has reached capacity
      if (schedule.trainees.length >= 10) {
        throw createError(400, "Schedule has reached its maximum capacity.");
      }
  
      // Check if the trainee is already booked
      if (schedule.trainees.includes(req.user.id)) {
        throw createError(400, "You are already booked for this schedule.");
      }
  
      // Add the trainee to the schedule
      schedule.trainees.push(req.user.id);
      await schedule.save();
  
      res.status(200).json({ message: "Schedule booked successfully", schedule });
    } catch (error) {
      next(error);
    }
  };

  // Get today's schedules for the logged-in trainee
exports.getTodaySchedulesForTrainee = async (req, res, next) => {
    try {
      const traineeId = req.user.id;
      const today = new Date();
  
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      const schedules = await Schedule.find({
        trainees: traineeId,
        date: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("trainer", "name email")
        .select("date timeSlot trainer")
        .exec();
  
      res.status(200).json({ message: "Today's schedules fetched successfully", schedules });
    } catch (error) {
      next(error);
    }
  };

  exports.getTodaySchedulesForTrainer = async (req, res, next) => {
    try {
      const trainerId = req.user.id;
      const today = new Date();

      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
  
      // Find schedules for today assigned to the trainer
      const schedules = await Schedule.find({
        trainer: trainerId,
        date: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("trainees", "name email")
        .select("date timeSlot trainees")
        .exec();
  
      res.status(200).json({ message: "Today's schedules fetched successfully", schedules });
    } catch (error) {
      next(error);
    }
  };