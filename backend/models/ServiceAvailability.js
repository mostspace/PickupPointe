const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const ServiceAvailability = mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location"
    },
    pickupTime: {
      from: {
        type: String,
      },
      to: {
        type: String,
      },
      isAvailable: {
        type: Boolean,
        default: false,
      },
    },
    deliveryTime: {
      from: {
        type: String,
      },
      to: {
        type: String,
      },
      isAvailable: {
        type: Boolean,
        default: false,
      },
    }
  },
  {
    timestamps: true,
  }
)
const ServiceAvailabilityModel = mongoose.model("ServiceAvailability", ServiceAvailability);
module.exports = ServiceAvailabilityModel;