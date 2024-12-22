const express = require('express');
const { placeOrder, getOrders, getOrdersByLocation, updateOrder, deleteOrder, getOrderById } = require('../controllers/orderController');

const multer = require("multer");
const { createPaymentIntent } = require('../controllers/paymentController');
const {verifyToken} = require("../middleware/authMiddleware");
const upload = multer();

const router = express.Router();

router.post("/", upload.none(), placeOrder);
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrderById);
router.get("/:locationId", getOrdersByLocation);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;
