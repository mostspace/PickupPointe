const express = require('express');
const { accessChats, fetchAllChats, deleteChat } = require('../controllers/rtChatController');
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", accessChats);
router.get("/", fetchAllChats);
router.delete('/:chatId', deleteChat);

module.exports = router;
