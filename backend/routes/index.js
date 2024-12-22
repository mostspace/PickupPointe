const express = require("express");
const router = express.Router();

// Routes
const userRoutes = require("./userRoutes");
const shopperRoutes = require("./shopperRoutes");
const vendorRoutes = require("./vendorRoutes");
const notificationRoutes = require("./notificationRoutes");
const locationRoutes = require("./locationRoutes");
const itemRoutes = require("./itemRoutes");
const itemCategoryRoutes = require("./itemCategoryRoutes");
const modifierRoutes = require("./modifierRoutes");
const tabletUserRoutes = require("./tabletUserRoutes");
const shopRoutes = require("./shopRoutes");
const reviewRoutes = require("./reviewRoutes");
const messageRoutes = require("./messageRoutes");
const paymentRoutes = require("./paymentRoutes");
const deliveryRoutes = require("./deliveryRoutes");
const rtChatRoutes = require("./rtChatRoutes");
const rtMessageRoutes = require("./rtMessageRoutes");
const teamMemberRoutes = require("./teamMemberRoutes");
const orderRoutes = require("./orderRoutes");
const subscriptionRoutes = require('./subscriptionRoutes');
const { verifyToken } = require("../middleware/authMiddleware");

// Test route
router.get("/test", (req, res) => {
  res.send("Test: Success");
});

router.use("/user", userRoutes);
router.use("/shopper", shopperRoutes);
router.use("/vendor", vendorRoutes);
router.use("/notification", notificationRoutes);
router.use("/location", locationRoutes);
router.use("/item", itemRoutes);
router.use("/item-category", itemCategoryRoutes);
router.use("/modifier", modifierRoutes);
router.use("/tablet-user", tabletUserRoutes);
router.use("/shop", shopRoutes);
router.use("/review", reviewRoutes);
router.use("/messages", verifyToken, messageRoutes);
router.use("/delivery", deliveryRoutes);
router.use("/rtchat", rtChatRoutes);
router.use("/rtmessage", rtMessageRoutes);
router.use("/team", teamMemberRoutes);
router.use("/order", orderRoutes);
router.use('/payment', paymentRoutes);
router.use('/subscription', subscriptionRoutes);

module.exports = router;
