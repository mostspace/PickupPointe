const mongoose = require("mongoose");
const RTChatModel = require("../models/RT_Chat");
const RTMessageModel = require("../models/RT_Message");
const Vendor = require("../models/Vendor");
const Shopper = require("../models/Shopper");

const accessChats = async (req, res) => {
    try {
        const { userId, opponentId, userType } = req.body;
        if (!userId || !opponentId || !userType) {
            return res.status(400).json({ message: "Provide Valid User info" });
        }
        let chatExists = await RTChatModel.find({
            isGroup: false,
            $and: [
                { users: { $elemMatch: { userId: userId } } },
                { users: { $elemMatch: { userId: opponentId } } },
            ],
        })
            .populate({
                path: 'users',
                // model: userType.charAt(0).toUpperCase() + userType.slice(1),
                select: "-password",
            })
            .populate('latestMessage');
        const model = (userType == "vendor") ? Vendor : Shopper;
        chatExists = await model.populate(chatExists, {
            path: 'latestMessage.sender',
            model: userType.charAt(0).toUpperCase() + userType.slice(1),
            select: 'firstName lastName email avatar',
        });
        if (chatExists.length > 0) {
            return res.status(200).send(chatExists[0]);
        } else {
            let data = {
                chatName: 'sender',
                users: [
                    {
                        userId: userId, userModel: userType.charAt(0).toUpperCase() + userType.slice(1)
                    },
                    {
                        userId: opponentId, userModel: userType == "vendor" ? "Shopper" : "Vendor"
                    }
                ],
                isGroup: false,
                // userModel: userType.charAt(0).toUpperCase() + userType.slice(1),
                groupModel: userType.charAt(0).toUpperCase() + userType.slice(1),
            };
            const newChat = await RTChatModel.create(data);
            const chat = await RTChatModel.find({ _id: newChat._id }).populate({
                path: 'users',
                // model: userType.charAt(0).toUpperCase() + userType.slice(1),
                select: "-password",
            });
            return res.status(200).json(chat);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

const fetchAllChats = async (req, res) => {
    try {
        const userId = req.query.userId;
        const userType = req.query.userType;
        console.log(userType, userId);
        const chats = await RTChatModel.find({
            users: { $elemMatch: { userId: userId } },
        })
        .populate('latestMessage')
        .populate('groupAdmin')
        .sort({ updateAt: -1 });
        const populatedChatsPromises = chats.map(async chat => {
            const populatedUsers = await Promise.all(chat.users.map(async user => {
                const userModel = user.userModel
                const populatedUser = await mongoose.model(userModel).findById(user.userId).select("firstName lastName email avatar");
                return populatedUser;
            }));
            return {
                ...chat.toObject(),
                users: populatedUsers,
            };
        });
        
        let populatedChats = await Promise.all(populatedChatsPromises);
        if (userType === 'shopper') {
            populatedChats = await Shopper.populate(populatedChats, {
                path: 'latestMessage.sender',
                select: 'firstName lastName email avatar'
            });
        } else {
            populatedChats = await Vendor.populate(populatedChats, {
                path: 'latestMessage.sender',
                select: 'firstName lastName email avatar',
            })
        }

        return res.status(200).json(populatedChats);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ message: "Chat ID is required" });
        }

        await RTMessageModel.deleteMany({ chatId: chatId });

        const deletedChat = await RTChatModel.findByIdAndDelete(chatId);

        if (!deletedChat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        return res.status(200).json({ message: "Chat deleted successfully", deletedChat });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}


module.exports = {
    accessChats,
    fetchAllChats,
    deleteChat
};