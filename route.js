const { createSchedule, bookSchedule, getTodaySchedulesForTrainee, getTodaySchedulesForTrainer } = require("./controllers/scheduleController");
const { createTrainer, updateTrainer, deleteTrainer, registerTrainee, updateTrainee, deleteTrainee, login } = require("./controllers/userController");
const authenticate = require("./middleware/authenticate");

const router = require("express").Router();

//login for all users
router.post("/login", login);

//trainer routes
router.post("/create-trainer", createTrainer);
router.put("/update-trainer", updateTrainer);
router.delete("/delete-trainer", deleteTrainer);

//trainee routes
router.post("/create-trainee", registerTrainee);
router.put("/update-trainee", updateTrainee);
router.delete("/delete-trainee", deleteTrainee);

//schedule
router.post("/create-schedule", createSchedule);
router.post("/book-schedule", bookSchedule);
router.get("/get-schedule-for-trainee",authenticate, getTodaySchedulesForTrainee);
router.get("/get-schedule-for-trainer",authenticate, getTodaySchedulesForTrainer);

module.exports = router;