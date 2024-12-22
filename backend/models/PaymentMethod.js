const mongoose = require('mongoose');

const PaymentMethodSchema = mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  },
  methodId: {
    type: String
  },
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  last4: {
    type: String
  },
  detailInfo: {
    type: Object
  },
}, {
  timestamps: true
});

const PaymentMethodModel = mongoose.model("PaymentMethod", PaymentMethodSchema);
module.exports = PaymentMethodModel;