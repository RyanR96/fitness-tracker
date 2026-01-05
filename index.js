const express = require("express");
const prisma = require("./client");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
const weightTrackerRoutes = require("./routes/api/weightTracker");
const verifyToken = require("./middleware/verifyToken");
const workoutRoutes = require("./routes/api/workout");
const completedWorkoutRoutes = require("./routes/api/completedWorkout");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

async function testPrismaConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log("Prisma connected, this many users in DB: " + users.length);
  } catch (err) {
    console.error("Prisma error in index", err);
  }
}

testPrismaConnection();

app.get("/", (req, res) => {
  res.json({
    message: "Fitness Api",
  });
});

app.use("/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/completedWorkouts", completedWorkoutRoutes);
app.use("/api/weightTracker", weightTrackerRoutes);

/* app.post("/api/posts", verifyToken, (req, res) => {      Same as below, just old method, leaving here for learning
  jwt.verify(req.token, "secret", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Success",
        authData,
      });
    }
  });
}); */

app.post("/api/posts", verifyToken, (req, res) => {
  res.json({
    message: "Success",
    authData: req.user,
  });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
