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

module.exports = {
  getCompletedWorkouts,
};
