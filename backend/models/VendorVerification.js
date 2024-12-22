const mongoose = require("mongoose");

const VendorVerificationSchema = new mongoose.Schema(
  {
    vendorId: {
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

const VendorVerificationModel = mongoose.model(
  "VendorVerification",
  VendorVerificationSchema
);
module.exports = VendorVerificationModel;
