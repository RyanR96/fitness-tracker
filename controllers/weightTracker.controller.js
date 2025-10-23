const prisma = require("../client");

const getAllWeight = async (req, res) => {
  try {
    const weight = await prisma.WeightEntry.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "asc" },
    });
    res.json(weight);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get  weight", message: err });
  }
};

const addWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;
    const userId = req.user.id;
    if (!userId || !weight) {
      return res.status(400).json({ error: "Missing weight/userID" });
    }
    const newWeightEntry = await prisma.weightEntry.create({
      data: {
        userId,
        weight: parseFloat(weight),
        date: date ? new Date(date) : new Date(),
      },
    });
    res.status(201).json(newWeightEntry);
  } catch (err) {
    console.error("Error adding weight", err);
    res.status(500).json({ error: "Failed to add new weight entry" });
  }
};

module.exports = {
  getAllWeight,
  addWeight,
};
