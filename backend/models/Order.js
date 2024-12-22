const mongoose = require("mongoose");
const {Schema, Types} = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    /*orderer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shopper",
        default: null
    },*/
    orderer: {
      type: Schema.Types.Mixed,
      set: function (value) {
        if (Types.ObjectId.isValid(value)) {
          return new Types.ObjectId(value);
        }
        return String(value);
      },
    },
    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },
    package: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item"
        },
        replaced: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item"
        },
        quantity: {
          type: Number
        },
        selectedItems: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ModifierItem"
          }
        ],
        variant: String
      },
    ],
    deliveryType: {
      type: String,
      required: true,
    },
    orderLocation: {
      type: Schema.Types.Mixed,
      set: function (value) {
        if (Types.ObjectId.isValid(value)) {
          return new Types.ObjectId(value);
        }
        return String(value);
      },
      required: true
    },
    time: {
      pickupTime: {
        type: String
      },
      pickupDate: {
        type: String
      },
      estimatedTime: {
        type: String
      },
      estimatedDate: {
        type: String
      },
    },
    fee: {
      deliveryFee: {
        type: String
      },
      platfomrFee: {
        type: String
      },
      processingFee: {
        type: String
      },
      tip: {
        type: String
      },
      tax: {
        type: String
      },
    },
    contacts: {
      notificationEmail: {
        type: String
      },
      notificationNumber: {
        type: String
      },
      contactEmail: {
        type: String
      },
      contactNumber: {
        type: String
      },
    },
    notes: {
      type: String
    },
    status: {
      type: String,
      default: "pending"
    },
    total: {
      type: Number
    },
    subTotal: {
      type: Number
    },
    orderLog: [
      {
        logTime: String,
        title: String,
        note: String,
      }
    ],
    deliveryStatus: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true,
  }
)
const OrderModel = mongoose.model("Order", OrderSchema);
module.exports = OrderModel;