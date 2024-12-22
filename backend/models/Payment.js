const mongoose = require("mongoose");

const PaymentSchema = mongoose.Schema(
    {
        paymentIntentId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        paymentMethodId: { type: String, required: true },
        paymentMethodConfId: { type: String, required: true },
        status: { type: String, required: true },
        clientSecret: { type: String, required: true },
        customer: {
            id: {
                type: String
            },
            name: {
                type: String
            },
            email: {
                type: String
            },
            country: {
                type: String
            }
        }
    },
    {
        timestamps: true,
    }
)
const PaymentModel = mongoose.model("Payment", PaymentSchema);
module.exports = PaymentModel;