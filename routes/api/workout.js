const express = require("express");
const prisma = require("../../client");
const verifyToken = require("../../middleware/verifyToken");
const workoutController = require("../../controllers/workout.controller");

const router = express.Router();

// Should be in it's own file... but it's only one!
router.get("/exerciseName", verifyToken, workoutController.getAllExercises);

router.get("/", verifyToken, workoutController.getAllWorkouts);

router.get("/:id", verifyToken, workoutController.getWorkoutById);

router.post("/", verifyToken, workoutController.createWorkout);

router.patch("/:id/exercises", verifyToken, workoutController.updateExercise);

//Patch workout name

router.patch("/:id", verifyToken, workoutController.updateWorkoutName);

router.delete("/:id", verifyToken, workoutController.deleteWorkout);

module.exports = router;
