const mongoose = require("mongoose");

const VendorSettingSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
    unique: true,
  },
  settings: {
    pickupNotification: { type: Boolean, default: false },
    dropOffNotification: { type: Boolean, default: false },
    enableChat: { type: Boolean, default: false },
    qrCodeSecurity: { type: Boolean, default: false },
    emailACopyofOrder: { type: Boolean, default: false },
  },
  courierDeliveryFees: {
    useThirdParty: { type: Boolean, default: true },
    offerFreeMile: {
      isUse: { type: Boolean, default: true },
      minMileAmount: { type: Number, default: 0 },
      mustSpend: { type: Number, default: 0 },
    },
    chargeBeyondTheFree: Number,
    costPer: {
      type: String,
      enum: ["delivery", "mile"],
      default: "mile",
    },
  },
  taxRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  feeStructure: {
    customerFee: {
      type: Number,
      min: 0,
      max: 100,
      default: 25,
    },
    passCreditCardFeeToCustomer: { type: Boolean, default: false },
  },
  discounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
  ],
});

const VendorSettingModel = mongoose.model("VendorSetting", VendorSettingSchema);

module.exports = VendorSettingModel;
