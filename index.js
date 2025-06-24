const express = require("express");
const prisma = require("./client");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
const verifyToken = require("./middleware/verifyToken");

const app = express();
app.use(express.json());

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
