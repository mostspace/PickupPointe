const mongoose = require("mongoose");

const ShopperSettingSchema = new mongoose.Schema({
  shopperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shopper",
    required: true,
    unique: true,
  },
  notification: {
    ready: {
      type: Boolean,
      default: true,
    },
    delivery: {
      type: Boolean,
      default: true,
    },
    dropOff: {
      type: Boolean,
      default: true,
    },
  },
});

const ShopperSettingModel = mongoose.model(
  "ShopperSetting",
  ShopperSettingSchema
);

module.exports = ShopperSettingModel;
