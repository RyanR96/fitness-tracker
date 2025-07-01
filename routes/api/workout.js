const express = require("express");
const prisma = require("../../client");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.user.id },
      include: { exercises: true },
    });
    res.json(workouts);
  } catch (err) {
    console.error(err);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const workout = await prisma.workout.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { exercises: true },
    });
    res.json(workout);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
