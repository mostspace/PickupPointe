const mongoose = require("mongoose");

const OrderLocationSchema = mongoose.Schema(
    {
        deliveryType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryType"
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location"
        }
    },
    {
        timestamps: true,
    }
)
const OrderLocationModel = mongoose.model("OrderLocation", OrderLocationSchema);
module.exports = OrderLocationModel;