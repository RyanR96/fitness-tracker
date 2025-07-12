const prisma = require("../client");

const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.user.id },
      include: { exercises: true },
    });
    res.json(workouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get  workouts", message: err });
  }
};

const getWorkoutById = async (req, res) => {
  try {
    const workout = await prisma.workout.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
      include: { exercises: true },
    });
    res.json(workout);
  } catch (err) {
    console.error(err);
  }
};

const createWorkout = async (req, res) => {
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
    res.status(500).json({ message: "Failed to create workout", error: err });
  }
};

//Patch workout exercises               @@@@@@@@@@@@@@@ Can be made more efficiently, currently rebuilds exercise

const updateExercise = async (req, res) => {
  const workoutId = parseInt(req.params.id);
  const { newExercises = [] } = req.body;

  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.exercise.deleteMany({ where: { workoutId } });

    const updatedWorkout = await prisma.workout.update({
      where: { id: workoutId },
      data: {
        exercises: {
          create: newExercises.map(newExercise => ({
            exerciseTemplate: {
              connect: { name: newExercise },
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
    res.status(200).json(updatedWorkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

const updateWorkoutName = async (req, res) => {
  const workoutId = parseInt(req.params.id);
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "New valid name required" });

  try {
    const updatedWorkout = await prisma.workout.update({
      where: { id: workoutId },
      data: { name },
    });
    res.status(200).json(updatedWorkout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

const deleteWorkout = async (req, res) => {
  const workoutId = parseInt(req.params.id);

  try {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout || workout.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.workout.delete({
      where: { id: workoutId },
    });

    res.status(200).json({ message: "Workout deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workout" + err });
  }
};

module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateExercise,
  updateWorkoutName,
  deleteWorkout,
};
