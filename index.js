const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middleware/verifyToken");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Fitness Api",
  });
});

app.use("/auth", authRoutes);

app.post("/api/posts", verifyToken, (req, res) => {
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
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
