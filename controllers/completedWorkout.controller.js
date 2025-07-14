const prisma = require("../client");

const getCompletedWorkouts = async (req, res) => {
  try {
    const completedWorkouts = await prisma.completedWorkout.findMany({
      where: { userId: req.userId },
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
    res.status(500);
  }
};

const getCompletedWorkoutById = async (req, res) => {
  try {
    const completedWorkout = await prisma.completedWorkout.findFirst({
      where: { id: parseInt(req.params.id), userId: req.user.id },
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
    if (!completedWorkout) {
      return res.status(404).json({ error: "Completed workout not found" });
    }
    res.status(200).json(completedWorkout);
  } catch {
    console.error(err);
    res
      .status(500)
      .json({ error: "Could not get completed workout ", message: err });
  }
};

module.exports = {
  getCompletedWorkouts,
  getCompletedWorkoutById,
};
