const express = require("express");
const prisma = require("../client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// router.post("/login", (req, res) => {
//   // Mock user
//   const mockUser = {
//     id: 2,
//     name: "cristiano",
//     password: 123,
//   };
//   jwt.sign({ user: mockUser }, "secret", { expiresIn: "1h" }, (err, token) => {
//     res.json({
//       token: token,
//     });
//   });
// });

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username: username },
    });
    if (!user) return res.status(401).json({ message: "Invalid username" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "14d" });
    res.json({ token });
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username: username },
    });

    if (existingUser)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
