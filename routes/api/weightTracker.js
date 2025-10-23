const express = require("express");
const prisma = require("../../client");
const verifyToken = require("../../middleware/verifyToken");
const weightTrackerController = require("../../controllers/weightTracker.controller");

const router = express.Router();

router.get("/", verifyToken, weightTrackerController.getAllWeight);

router.post("/", verifyToken, weightTrackerController.addWeight);

module.exports = router;
