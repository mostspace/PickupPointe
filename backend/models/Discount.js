const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscountSchema = new Schema(
  {
    discountCode: {
      type: String,
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      default: "dollars",
      enum: ["dollars", "percentage"],
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    ],
    time: {
      from: {
        type: String
      },
      to: {
        type: String
      }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
