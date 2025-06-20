const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.get("/", (req, res) => {
  res.send("Fitness Api");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
});

app.listen(3333, () => {
  console.log("listening on port 3333");
});
