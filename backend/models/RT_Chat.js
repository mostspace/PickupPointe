const mongoose = require("mongoose");

const ChatSchema = mongoose.Schema(
	{
    participants: [
      {
				user: {
					type: mongoose.Schema.Types.ObjectId
	      },
	      role: {
					type: String,
		      enum: ["merchant", "shopper", "vendor"],
	      }
			},
    ],
		isBlocked: [mongoose.Schema.Types.ObjectId],
		isDeleted: [mongoose.Schema.Types.ObjectId],
		isArchived: [mongoose.Schema.Types.ObjectId],
		isMuted: [mongoose.Schema.Types.ObjectId],
		participantsKey: {
			type: String
		},
		
    lastMessage: {
			type: String
    }
  },
	{
		timestamps: true,
	}
)
const RTChatModel = mongoose.model("RTChat", ChatSchema);
module.exports = RTChatModel;