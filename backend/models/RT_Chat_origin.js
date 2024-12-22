const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
    {
        photo: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/512/9790/9790561.png'
        },
        chatName: {
            type: String,
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
        users: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: "userModel"
                },
                userModel: {
                    type: String,
                    enum: ["Shopper", "Vendor"],
                    required: true
                }
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RTMessage"
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'groupModel'
        },
        groupModel: {
            type: String,
            required: true,
            enum: ["Shopper", "Vendor"]
        }
    },
    {
        timestamps: true,
    }
)
const RTChatModel = mongoose.model("RTChat", ChatSchema);
module.exports = RTChatModel;