const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  type: {
    type: String,
    default: 'basic'
  },
  lastPurchasedDate: {
    type: Date
  },
  expiredDate: {
    type: Date
  },
  plan: {
    type: String
  },
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    }
  ],
  status: {
    type: String
  },
  customerId: {
    type: String
  },
  subId: {
    type: String
  },
  priceId: {
    type: String
  },
  price: {
    type: Number,
    default: 0
  }
}, {
  timeseries: true
});

const SubscriptionModel = mongoose.model('Subscription', SubscriptionSchema);

module.exports = SubscriptionModel;