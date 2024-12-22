const mongoose = require("mongoose");

const MerchantUserSchema = new mongoose.Schema(
  {
    pickupId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    permissions: {
      type: [String],
      enum: ["vendor-portal", "tablet-user"],
      default: ["tablet-user"],
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    locations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
        required: true,
      },
    ],
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
      },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Suspended", "Inactive"], // Corrected enum:syntax
    },
  },
  { timestamps: true }
);

const MerchantUserModel = mongoose.model("Merchant", MerchantUserSchema);
module.exports = MerchantUserModel;
