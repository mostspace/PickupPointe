const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId },
    role: {
      type: String,
      default: "tabletUser",
      enum: ["tabletUser", "vendor", "shopper"],
    },
    message: {
      type: String,
      maxlength: 5000,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);
module.exports = FeedbackModel;
