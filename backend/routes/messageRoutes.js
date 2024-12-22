const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  upload,
  convertAndUploadToS3,
} = require("../middleware/fileUploadMiddleware");
const MessageController = require("../controllers/messageController");

router.get("/chat-contacts", verifyToken, MessageController.getContacts);
router.get("/chat-logs", verifyToken, MessageController.getChatLogs);
router.get("/search-contact", verifyToken, MessageController.getContactBySearch);

// Message connection routes
router.post("/connection", verifyToken, MessageController.addConnection);
router.get("/connection", verifyToken, MessageController.getAllConnections);

router.get("/unread", verifyToken, MessageController.getUnreadMessages);
router.put("/mark-read", verifyToken, MessageController.setMessagesAsRead);
router.post("/", verifyToken, MessageController.addMessage);
router.get(
  "/:receiverId",
  verifyToken,
  MessageController.getAllMessagesInOneRoom
);
router.patch("/:messageId", verifyToken, MessageController.updateMessage);
router.delete("/:messageId", verifyToken, MessageController.deleteMessage);

router.post(
  "/upload-image",
  [verifyToken, upload.single("photo"), convertAndUploadToS3("message/images")],
  MessageController.uploadMessageImage
);

module.exports = router;
