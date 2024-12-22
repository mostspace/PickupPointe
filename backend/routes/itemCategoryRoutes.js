const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const itemController = require("../controllers/itemController");

// Item Category Routes
router.post("", verifyToken, itemController.addItemCategory);
router.delete("/:id", verifyToken, itemController.deleteItemCategory);
router.put("/:id", verifyToken, itemController.updateItemCategory);
router.get("", verifyToken, itemController.getItemCategories);

module.exports = router;
