const mongoose = require("mongoose");

const ShopperRecoverSchema = new mongoose.Schema(
  {
    shopperId: {
      type: mongoose.Schema.Types.ObjectId, // Store as ObjectId for better querying
      required: true,
      unique: true,
    },
    recoverCode: {
      type: String,
      required: true,
    },
    recovered: {
      type: Boolean,
      default: false,
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

const ShopperRecoverModel = mongoose.model(
  "ShopperRecover",
  ShopperRecoverSchema
);

module.exports = ShopperRecoverModel;
