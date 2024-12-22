const express = require('express');
const { sendMessage, getMessages, deleteMessage } = require('../controllers/rtMessageController');
const { verifyToken } = require("../middleware/authMiddleware");
const { upload, chatAttachmentsUploadToS3 } = require('../middleware/fileUploadMiddleware');

const router = express.Router();

router.post("/", upload.array('files'), chatAttachmentsUploadToS3("chat"), sendMessage);
router.get("/:chatId/:senderModel", getMessages);
router.delete("/:messageId", deleteMessage)

module.exports = router;
