const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    shopperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shopper",
      required: true,
    },
    comment: {
      type: String,
      maxlength: 5000,
      trime: true,
    },
    rate: {
      type: Number,
      min: [1, "Mark must be at least 1"],
      max: [5, "Mark cannot exceed 5"],
      default: 5,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const ReviewModel = mongoose.model("Review", ReviewSchema);
module.exports = ReviewModel;
