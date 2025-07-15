const express = require("express");
const prisma = require("../../client");
const verifyToken = require("../../middleware/verifyToken");
const completedWorkoutController = require("../../controllers/completedWorkout.controller");

const router = express.Router();

router.get("/", verifyToken, completedWorkoutController.getCompletedWorkouts);
router.get(
  "/:id",
  verifyToken,
  completedWorkoutController.getCompletedWorkoutById
);

router.post(
  "/",
  verifyToken,
  completedWorkoutController.createCompletedWorkout
);

router.delete(
  "/:id",
  verifyToken,
  completedWorkoutController.deleteCompletedWorkout
);

module.exports = router;
