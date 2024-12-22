const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const locationController = require("../controllers/locationController");

//Location Routes
router.get("", verifyToken, locationController.getLocations);
router.post("", verifyToken, locationController.addLocation);
router.delete("/:id", verifyToken, locationController.deleteLocation);
router.put("/:id", verifyToken, locationController.updateLocation);

module.exports = router;
