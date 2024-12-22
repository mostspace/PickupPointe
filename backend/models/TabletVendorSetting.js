const mongoose = require("mongoose");

const TabletVendorSettingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
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

const TabletVendorSettingModel = mongoose.model(
  "TabletVendorSetting",
  TabletVendorSettingSchema
);
module.exports = TabletVendorSettingModel;
