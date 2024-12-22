const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["tabletUser", "shopper", "vendor"],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverRole: {
      type: String,
      enum: ["tabletUser", "shopper", "vendor"],
    },
    content: {
      type: String,
      maxlength: 5000,
    },
    images: {
      type: [String],
      default: [],
    },
    files: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: "created",
      enum: ["created", "edited", "deleted"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
