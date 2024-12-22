const express = require('express');
const router = express.Router();

const {
  verifyToken,
  verifyTokenAndVendor,
} = require('../middleware/authMiddleware');

const subscriptionController = require('../controllers/subscriptionController');

router.post('/', [verifyToken, verifyTokenAndVendor], subscriptionController.create);
router.patch('/:id', [verifyToken, verifyTokenAndVendor], subscriptionController.update);

module.exports = router;
