const mongoose = require("mongoose");

const ShopSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    logo: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },
    name: {
      type: String,
    },
    shopId: { type: String },
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],
    aboutUs: { type: String },
    phoneNumber: { type: String, trim: true },
    supportEmail: { type: String, trim: true },
    website: { type: String },
    socialMedias: [
      {
        type: String,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ShopCategory",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    averageRate: {
      type: Number,
      default: 0,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    savePercent: {
      type: Number,
      default: 0,
    },
    businessDetail: {
      name: {
        type: String
      },
      entity: {
        type: String
      },
      website: {
        type: String
      },
      address: {
        type: String
      },
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
    payouts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
      }
    ],
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    platformFee: {
      rate: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const ShopModel = mongoose.model("Shop", ShopSchema);
module.exports = ShopModel;
