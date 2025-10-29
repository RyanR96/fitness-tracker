const prisma = require("../client");

/** This one should probably be in it's seperate controller.... */
const getAllExercises = async (req, res) => {
  try {
    const exercises = await prisma.exerciseTemplate.findMany({
      select: { id: true, name: true },
    });
    res.json(exercises);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get exercises", message: err });
  }
};

const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.user.id },
      include: {
        exercises: {
          include: { exerciseTemplate: true },
          orderBy: { order: "asc" },
        },
      },
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
      include: {
        exercises: {
          include: { exerciseTemplate: true },
          orderBy: { order: "asc" },
        },
      },
    });
    res.json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not get  workout ", message: err });
  }
};

const createWorkout = async (req, res) => {
  const { name, exerciseTemplateName } = req.body;
  if (!name || !Array.isArray(exerciseTemplateName)) {
    return res.status(400).json({ error: "Name and exercises must be listed" });
  }
  try {
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        userId: req.user.id,
        name: name,
      },
    });

    if (existingWorkout)
      return res.status(400).json({
        message: "Workout name already exists, please enter a new one",
      });
    const createdWorkout = await prisma.workout.create({
      data: {
        name,
        userId: req.user.id,
        exercises: {
          create: exerciseTemplateName.map((templateName, i) => ({
            exerciseTemplate: {
              connect: {
                name: templateName,
              },
            },
            order: i,
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
  getAllExercises,
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateExercise,
  updateWorkoutName,
  deleteWorkout,
};
