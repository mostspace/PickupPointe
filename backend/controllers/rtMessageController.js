const RTMessageModel = require("../models/RT_Message");
const RTChatModel = require("../models/RT_Chat");

const sendMessage = async (req, res) => {
    const { chatId, message, senderModel, senderId } = req.body;
    console.log("sendmessage", chatId, message, senderModel)

    if (!['shopper', 'vendor'].includes(senderModel)) {
        return res.status(400).json({ error: 'Invalid sender model type' });
    }
    try {
        let attachments;
        if (req.files) {
            attachments = req.files.map((file) => {
                return {
                    fileUrl: file.location,
                    fileType: file.mimetype,
                    fileName: file.originalname
                }
            })
        }
        let msg = await RTMessageModel.create({ 
            sender: senderId, 
            senderModel: senderModel.charAt(0).toUpperCase() + senderModel.slice(1), 
            message, 
            chatId,
            attachments
        });

        let populatedMsg;
        if (senderModel === 'shopper') {
            populatedMsg = await msg.populate('sender', 'firstName lastName email avatar');

            populatedMsg = await populatedMsg.populate({
                path: 'chatId',
                select: 'chatName isGroup users',
                model: 'RTChat',
                populate: {
                    path: 'users',
                    select: 'firstName lastName email avatar',
                    model: 'Shopper', 
                },
            });
        } else if (senderModel === 'vendor') {
            populatedMsg = await msg.populate('sender', 'firstName lastName email avatar');

            populatedMsg = await populatedMsg.populate({
                path: 'chatId',
                select: 'chatName isGroup users',
                model: 'RTChat',
                populate: {
                    path: 'users',
                    select: 'firstName lastName email avatar',
                    model: 'Vendor',
                },
            });
        }
        await RTChatModel.findByIdAndUpdate(chatId, {
            latestMessage: populatedMsg,
        });
        res.status(200).send(populatedMsg);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

const getMessages = async (req, res) => {
    const { chatId, senderModel } = req.params;
    console.log("chatId", chatId, senderModel);
    try {
        let messages;
        messages = await RTMessageModel.find({ chatId })
            .populate({
                path: 'sender',
                senderModel: function(doc) {
                    return doc.senderModel;
                },
                select: 'firstName lastName email avatar'
            })
            .populate({
                path: 'chatId',
                model: 'RTChat'
            })
        // if (senderModel === 'shopper') {
        //     messages = await RTMessageModel.find({ chatId })
        //     .populate({
        //         path: 'sender',
        //         model: 'Shopper',
        //         select: 'firstName lastName email avatar'
        //     })
        //     .populate({
        //         path: 'chatId',
        //         model: 'RTChat'
        //     })
        // } else if (senderModel == 'vendor') {
        //     messages = await RTMessageModel.find({ chatId })
        //     .populate({
        //         path: 'sender',
        //         model: 'Vendor',
        //         select: 'firstName lastName email avatar'
        //     })
        //     .populate({
        //         path: 'chatId',
        //         model: 'RTChat'
        //     })
        // }
        console.log("messages here", messages)
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params; 

        if (!messageId) {
            return res.status(400).json({ message: "Message ID is required" });
        }

        const deletedMessage = await RTMessageModel.findByIdAndDelete(messageId).populate({
            path: 'chatId',
            model: 'RTChat'
        });

        if (!deletedMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        return res.status(200).json({ message: "Message deleted successfully", data: deletedMessage });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    sendMessage,
    getMessages,
    deleteMessage
};