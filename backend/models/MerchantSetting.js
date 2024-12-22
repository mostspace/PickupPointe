const mongoose = require("mongoose");

const MerchantSettingSchema = new mongoose.Schema(
  {
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TabletUser",
      required: true,
      unique: true,
    },
    autoConfirmNewOrder: {
      type: Boolean,
      default: false,
    },
    volume: {
      type: String,
      default: "loud",
      enum: ["loud", "no-sound", "vibration"],
    },
    printer: {
      type: String,
    },
    ratePickup: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    appVersion: {
      version: { type: String },
      isUpdatable: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const MerchantSettingModel = mongoose.model(
  "MerchantSetting",
  MerchantSettingSchema
);
module.exports = MerchantSettingModel;
