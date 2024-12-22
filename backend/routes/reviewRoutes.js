const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

// Item Routes
router.get("/:shopId", reviewController.getAllReviewsOfShop);

module.exports = router;
