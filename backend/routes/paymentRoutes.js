const express = require('express');
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndVendor,
} = require('../middleware/authMiddleware');

const paymentController = require('../controllers/paymentController');

router.post('/check-card', verifyToken, paymentController.checkCard);
router.post('/', verifyToken, paymentController.createPaymentMethod);
router.post('/webhook', paymentController.webhook);

module.exports = router;
