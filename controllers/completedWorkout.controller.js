const prisma = require("../client");

const getCompletedWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ error: "User id is missing" });
    }
    const completedWorkouts = await prisma.completedWorkout.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        workout: true,
        exercises: {
          include: {
            exerciseTemplate: true,
            set: true,
          },
        },
      },
    });

    res.status(200).json(completedWorkouts);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not get completed workout ", message: err });
  }
};

const getCompletedWorkoutById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({ error: "Workout not found" });
    }
    const completedWorkout = await prisma.completedWorkout.findFirst({
      where: { id, userId: req.user.id },
      include: {
        workout: true,
        exercises: {
          include: {
            exerciseTemplate: true,
            set: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });
    if (!completedWorkout) {
      return res.status(404).json({ error: "Completed workout not found" });
    }
    res.status(200).json(completedWorkout);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not get completed workout ", message: err });
  }
};

const createCompletedWorkout = async (req, res) => {
  try {
    const { workoutId, completedExercises } = req.body;

    const createdCompletedWorkout = await prisma.completedWorkout.create({
      data: {
        userId: req.user.id,
        workoutId,
        date: new Date(),
        exercises: {
          create: completedExercises.map(exercise => ({
            order: exercise.order,
            exerciseTemplate: {
              connect: {
                name: exercise.exerciseTemplateName,
              },
            },
            set: {
              create: exercise.sets.map(s => ({
                weight: s.weight,
                reps: s.reps,
                formRating: s.formRating,
                dropset: s.dropset ?? false,
              })),
            },
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exerciseTemplate: true,
            set: true,
          },
        },
      },
    });
    res.status(200).json(createdCompletedWorkout);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not create completed workout", message: err });
  }
};

const deleteCompletedWorkout = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const cWorkout = await prisma.completedWorkout.findUnique({
      where: { id: id },
    });

    if (!cWorkout || cWorkout.userId !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.completedWorkout.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Completed workout deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workout" + err });
  }
};

module.exports = {
  getCompletedWorkouts,
  getCompletedWorkoutById,
  createCompletedWorkout,
  deleteCompletedWorkout,
};
