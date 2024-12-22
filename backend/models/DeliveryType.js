const mongoose = require("mongoose");

const DeliveryTypeSchema = mongoose.Schema(
    {
        type: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)
const DeliveryTypeModel = mongoose.model("DeliveryType", DeliveryTypeSchema);
module.exports = DeliveryTypeModel;