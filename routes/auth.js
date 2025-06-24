const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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

module.exports = router;
