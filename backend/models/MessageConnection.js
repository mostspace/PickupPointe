const mongoose = require("mongoose");

const MessageConnectionSchema = new mongoose.Schema(
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
    status: {
      type: String,
      default: "active",
      enum: ["active", "blocked"],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const MessageConnectionModel = mongoose.model(
  "MessageConnection",
  MessageConnectionSchema
);

module.exports = MessageConnectionModel;
