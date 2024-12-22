const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const notificationController = require("../controllers/notificationController");

//Notification Routes
router.get(
  "/get-notifications",
  verifyToken,
  notificationController.getNotifications
);

module.exports = router;
