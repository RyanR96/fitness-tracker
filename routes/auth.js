const express = require("express");
const prisma = require("../client");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
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

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser)
      return res.status(400).json({ message: "Username already taken" });

    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,
      },
    });
    res.json("success! user: " + username + " has been created");
  } catch (err) {
    res.send(err.message);
  }
});

module.exports = router;
