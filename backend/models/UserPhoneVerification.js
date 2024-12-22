const mongoose = require("mongoose");

const UserPhoneVerificationSchema = new mongoose.Schema(
  {
    userId: {
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

const UserPhoneVerificationModel = mongoose.model(
  "UserPhoneVerification",
  UserPhoneVerificationSchema
);
module.exports = UserPhoneVerificationModel;
