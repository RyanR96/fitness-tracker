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

router.post("/", verifyToken, async (req, res) => {
  const { name, exerciseTemplateName } = req.body;

  if (!name || !Array.isArray(exerciseTemplateName)) {
    return res.status(400).json({ error: "Name and exercises must be listed" });
  }
  try {
    const createdWorkout = await prisma.workout.create({
      data: {
        name,
        userId: req.user.id,
        exercises: {
          create: exerciseTemplateName.map(templateName => ({
            exerciseTemplate: {
              connect: {
                name: templateName,
              },
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
          },
        },
      },
    });
    res.status(201).json(createdWorkout);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
