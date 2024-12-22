const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: ["Shopper", "Vendor"],
    },
    type: {
      type: String,
      default: "none",
      enum: ["none", "warning", "drop_off", "pickup"],
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);
module.exports = NotificationModel;
