const MessageConnection = require("../models/MessageConnection");
const MerchantUser = require("../models/Merchant");
const Vendor = require("../models/Vendor");
const Shopper = require("../models/Shopper");
const Message = require("../models/Message");
const RtChatModel = require("../models/RT_Chat");
const RtMessageModel = require("../models/RT_Message");
const {ObjectId} = require("mongoose").Types;

exports.getUserChatContacts = async (userId, isArchive = false) => {
	console.log("isArchive", isArchive)
	let chats;
	if (isArchive) {
		chats = await RtChatModel.find({
			participants: {$elemMatch: {user: userId}},
			isDeleted: {$nin: [userId]},
			isArchived: {$in: [userId]}
		}).lean();
	} else {
		chats = await RtChatModel.find({
			participants: {$elemMatch: {user: userId}},
			isDeleted: {$nin: [userId]},
			isArchived: {$nin: [userId]}
		}).lean();
	}
	
	let result = [];
	for (let chat of chats) {
		let participants = await Promise.all(chat.participants.map(async (participant) => {
			let userModel = participant.role === "shopper" ? Shopper : participant.role === "vendor" ? Vendor : MerchantUser;
			let user = await userModel.findById(participant.user, "firstName lastName avatar").lean();
			return {
				...participant,
				user: {
					_id: user?._id,
					name: `${user?.firstName} ${user?.lastName[0]}`,
					avatar: user.avatar,
					unreadMessages: await RtMessageModel.countDocuments({
						chat: chat._id,
						"sender.user": {$ne: user._id},
						status: { $ne: "read" }
					}),
					role: participant.role,
				}
			};
		}));
		
		chat.opponentInfo = participants.find(p => p.user._id.toString() !== userId).user;
		chat.user = participants.find(p => p.user._id.toString() === userId)?.user;
		delete chat.participants;
		result.push(chat);
	}
	return result;
}
