const mongoose = require("mongoose");

const ShopperVerificationSchema = new mongoose.Schema(
  {
    shopperId: {
      type: mongoose.Schema.Types.ObjectId, // Store as ObjectId for better querying
      required: true,
      unique: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const ShopperVerificationModel = mongoose.model(
  "ShopperVerification",
  ShopperVerificationSchema
);
module.exports = ShopperVerificationModel;
