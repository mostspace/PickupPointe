const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    name: { type: String, required: true },
    address: {
      countryCode: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      street: { type: String, required: true },
    },
    contact: {
      phoneNumber: { type: String, required: true },
      firstName: { type: String },
      lastName: { type: String },
      supportEmail: {
        type: String,
        trim: true,
        default: "No email",
      },
    },
    pickup: {
      isUse: { type: Boolean, default: false, required: true },
      days: { type: Array },
      from: { type: String },
      to: { type: String },
    },
    delivery: {
      isUse: { type: Boolean, default: false, required: true },
      doorToDoor: {
        use: { type: Boolean },
        maxDistance: { type: Number },
      },
      postMail: { type: Boolean },
      days: { type: Array },
      from: { type: String },
      to: { type: String },
    },
    isPrivate: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isLive: { type: Boolean, default: false },
    coordinates: {
      type: { type: String, default: "Point", enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    taxRate: {
      type: String
    }
  },
  { timestamps: true }
);

LocationSchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Location", LocationSchema);
