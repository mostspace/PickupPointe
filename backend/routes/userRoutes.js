const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// User Routes
router.get("/get-current-user", verifyToken, userController.getCurrentUser);
router.get("/get-user-list", verifyToken, userController.getUserList);

module.exports = router;
