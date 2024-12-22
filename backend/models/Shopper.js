const mongoose = require("mongoose");

const ShopperSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    contactNumber: { type: String },
    contactEmail: {
      type: String,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    deliveryAddress: {
      countryCode: { type: String },
      city: { type: String },
      state: { type: String },
      street: { type: String },
      zipCode: { type: String },
    },
    coordinates: {
      longitude: { type: Number, default: -119.2921 },
      latitude: { type: Number, default: 36.3302 },
    },
    specialDeliveryInstruction: {
      type: String,
      default: "",
      trim: true,
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
      }
    ],
    primaryPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
    },
  },
  { timestamps: true }
);

const ShopperModel = mongoose.model("Shopper", ShopperSchema);
module.exports = ShopperModel;
