const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "senderModel"
        },
        senderModel: {
            type: String,
            required: true,
            enum: ["Shopper", "Vendor"]
        },
        message: {
            type: String,
            trim: true,
        },
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
        attachments: [
            {
                fileUrl: {
                    type: String,
                    required: true,
                },
                fileType: {
                    type: String,
                    required: true,
                },
                fileName: {
                    type: String,
                }
            }
        ]
    },
    {
        timestamps: true,
    }
)
const RTMessageModel = mongoose.model("RTMessage", MessageSchema);
module.exports = RTMessageModel;