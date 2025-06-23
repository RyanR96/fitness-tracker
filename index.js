const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Fitness Api",
  });
});

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

app.post("/auth/login", (req, res) => {
  // Mock user
  const mockUser = {
    id: 2,
    name: "cristiano",
    password: 123,
  };
  jwt.sign({ user: mockUser }, "secret", { expiresIn: "1h" }, (err, token) => {
    res.json({
      token: token,
    });
  });
});

function verifyToken(req, res, next) {
  //get auth header

  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(3000, () => {
  console.log("listening on port 3000");
});
