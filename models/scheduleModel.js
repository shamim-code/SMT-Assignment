const mongoose = require("mongoose");

// Define the Schedule Schema
const scheduleSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);


const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
