const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    firstName: { type: String },
    lastName: { type: String },
    contactNumber: { type: String },
    contactEmail: { type: String },
    role: {
      type: String,
      default: "vendor",
      required: true,
      enum: ["restaurant", "vendor"],
    },
    entityDetail: {
      name: { type: String },
      entity: { type: String },
      website: { type: String },
      supportNumber: { type: String },
      supportEmail: { type: String },
      countryCode: { type: String },
      city: { type: String },
      state: { type: String },
      street: { type: String },
      zipCode: { type: String },
    },
    avatar: { type: String, default: "" },
    status: { type: String, default: "active", enum: ["active", "suspended"] },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const VendorModel = mongoose.model("Vendor", VendorSchema);
module.exports = VendorModel;
