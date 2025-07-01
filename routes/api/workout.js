const express = require("express");
const prisma = require("../../client");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("workout route");
});

module.exports = router;
