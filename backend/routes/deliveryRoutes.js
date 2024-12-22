const express = require("express");
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndVendor,
} = require("../middleware/authMiddleware");

const deliveryController = require("../controllers/deliveryController");

router.post("/doordash-webhook", deliveryController.doordashWebHook);
router.post("/door-dash", deliveryController.createDoorDashDelivery);
router.get("/door-dash/:id", deliveryController.getDoorDashStatus);
router.put("/door-dash-cancel/:id", deliveryController.cancelDoorDashDelivery);
router.post("/door-dash-quote", deliveryController.createDoorDashQuote);
router.post(
  "/door-dash-quote/:id/accept",
  deliveryController.acceptDoorDashQuote
);

module.exports = router;
