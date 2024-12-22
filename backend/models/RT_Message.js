const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
	{
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RTChat",
    },
    sender: {
      user: mongoose.Schema.Types.ObjectId,
      role: {
				type: String,
	      enum: ["merchant", "shopper", "vendor"],
      }
    },
    message: {
      type: String,
      trim: true,
    },
		attachFile: {
			type: String
		},
    status: {
      type: String,
	    default: "sent"
    }
  },
	{
		timestamps: true,
	}
)
const RTMessageModel = mongoose.model("RTMessage", MessageSchema);
module.exports = RTMessageModel;