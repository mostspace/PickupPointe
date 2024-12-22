const RtChatModel = require("../../../models/RT_Chat");
const RtMessageModel = require("../../../models/RT_Message");
const ShopperModel = require("../../../models/Shopper");
const VendorModel = require("../../../models/Vendor");
const MerchantUserModel = require("../../../models/Merchant");
const {resolve} = require("url");
const { deleteFileFromS3UsingURL } = require("../../../utils/aws");
const Shopper = require("../../../models/Shopper");
const Vendor = require("../../../models/Vendor");
const MerchantUser = require("../../../models/Merchant");
const {getUserChatContacts} = require("../../../utils/chat");
const {ObjectId} = require("mongoose").Types;

exports.getContacts = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await getUserChatContacts(userId);
			resolve(result);
		} catch (error) {
			reject(error)
		}
	});
};

exports.createChat = (user1, user2) => {
	return new Promise(async(resolve, reject) => {
		try {
			const chat = await RtChatModel.findOne({
				$or: [
					{participantsKey: `${user1._id}.${user2._id}`},
					{participantsKey: `${user2._id}.${user1._id}`}
				]
			}).lean();
			if (chat) {
				const newChat = await RtChatModel.findOneAndUpdate({_id: chat._id}, {isDeleted: [], isArchived: [], isMuted: [], isBlocked: []});
				resolve(newChat);
			} else {
				const newChat = new RtChatModel({
					participants: [
						{user: user1._id, role: user1.role},
						{user: user2._id, role: user2.role}
					],
					participantsKey: `${user1._id}.${user2._id}`,
					lastMessage: ""
				});
				await newChat.save();
				resolve(newChat);
			}
		} catch (err) {
			reject(err);
		}
	});
}

exports.saveChatLog = (chatId, message, fileLocation, sender, role) => {
	return new Promise(async (resolve, reject) => {
		try {
			const newMessage = new RtMessageModel({
				chat: chatId,
				message,
				attachFile: fileLocation,
				sender: {user: sender, role},
			})
			await newMessage.save();
			const chat = await RtChatModel.findByIdAndUpdate(chatId, {lastMessage: message});
			resolve({chat, newMessage});
		} catch (err) {
			reject(err);
		}
	});
}

exports.deleteMessage = (chatId, messageId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const message = await RtMessageModel.findById(messageId);
			if (message.attachFile !== "") {
				await deleteFileFromS3UsingURL(message.attachFile);
			}
			await RtChatModel.findOneAndUpdate({_id: chatId, lastMessage: message.message}, {lastMessage: "[Deleted message]"});
			await RtMessageModel.findByIdAndDelete(messageId);
			resolve({message: message.message, chatId, messageId});
		} catch (error) {
			console.log(error);
			reject(error)
		}
	});
}

exports.deleteChat = (chatId, userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const chat = await RtChatModel.findById(chatId);
			console.log(chat)
			if (chat.isDeleted?.length < 1) {
				await RtChatModel.findByIdAndUpdate(chatId, {$push: {isDeleted: userId}})
			} else {
				await RtChatModel.findById(chatId).deleteOne();
				await RtMessageModel.deleteMany({chat: chatId});
			}
			resolve(true);
		} catch (err) {
			reject(err);
		}
	});
}

exports.blockChat = (chatId, userId, isBlock) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updateQuery = {$push: {isBlocked: userId}};
			if (!isBlock) {
				updateQuery = {$pull: {isBlocked: userId}};
			}
			await RtChatModel.findByIdAndUpdate(chatId, updateQuery);
			resolve(true);
		} catch (err) {
			reject(err);
		}
	});
}

exports.muteChat = (chatId, userId, isMute) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updateQuery = {$push: {isMuted: userId}};
			if (!isMute) {
				updateQuery = {$pull: {isMuted: userId}};
			}
			await RtChatModel.findByIdAndUpdate(chatId, updateQuery)
			resolve(true);
		} catch (err) {
			reject(err);
		}
	});
}

exports.archiveChat = (chatId, userId, isArchive) => {
	return new Promise(async (resolve, reject) => {
		try {
			let updateQuery = {$push: {isArchived: userId}};
			if (!isArchive) {
				updateQuery = {$pull: {isArchived: userId}};
			}
			await RtChatModel.findByIdAndUpdate(chatId, updateQuery)
			resolve(true);
		} catch (err) {
			reject(err);
		}
	});
}
