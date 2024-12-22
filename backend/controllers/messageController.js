const MessageConnection = require("../models/MessageConnection");
const MerchantUser = require("../models/Merchant");
const Vendor = require("../models/Vendor");
const Shopper = require("../models/Shopper");
const Message = require("../models/Message");

const mongoose = require("mongoose");
const RtChatModel = require("../models/RT_Chat");
const RtMessageModel = require("../models/RT_Message");
const {getUserChatContacts} = require("../utils/chat");
const {ObjectId} = require("mongoose").Types;

exports.getContacts = async (req, res) => {
  const userId = req.userId;
  const {tab} = req.query;
  let result = await getUserChatContacts(userId, tab === "archived");
  
  return res.json(result)
};

exports.getChatLogs = async (req, res) => {
  const userId = req.userId;
  const chatId = req.query.chatId;
  const {
    skip = 0,
  } = req.params;
  
  await RtMessageModel.updateMany({chat: chatId, "sender.user": {$ne: userId}, status: "sent"}, {status: "read"});
  
  let chats = await RtMessageModel
    .find({chat: chatId}, "_id sender message status createdAt attachFile")
    // .skip(parseInt(skip))
    .sort({createdAt: -1})
    // .limit(20)
    .lean();

  chats = chats.sort((chatA, chatB) => chatA.createdAt - chatB.createdAt);
  
  return res.json(chats)
};

exports.getContactBySearch = async (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }
  
  try {
    const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
    
    const shoppers = await Shopper.find({
      $or: [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } }
      ]
    }, 'firstName lastName avatar');
    
    const vendors = await Vendor.find({
      $or: [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } }
      ]
    }, 'firstName lastName avatar');
    
    const merchants = await MerchantUser.find({
      $or: [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } }
      ]
    }, 'firstName lastName avatar');
    
    const results = [
      ...shoppers.map(user => ({ ...user.toObject(), role: 'shopper' })),
      ...vendors.map(user => ({ ...user.toObject(), role: 'vendor' })),
      ...merchants.map(user => ({ ...user.toObject(), role: 'merchant' }))
    ];
    
    return res.json(results);
  } catch (error) {
    console.log("getContactBySearch error:", error);
    return res.json([]);
  }
};

/////////////////////////////////////////////

exports.addMessage = async (req, res) => {
  const senderId = req.userId;
  const senderRole = req.userRole;
  const { receiverId, receiverRole, content } = req.body;

  try {
    const newMessage = await Message.create({
      senderId,
      senderRole,
      receiverId,
      receiverRole,
      content,
    });

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    console.log("addMessage endpoint:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateMessage = async (req, res) => {
  const messageId = req.params.messageId;
  const { content, images, files } = req.body;
  const senderId = req.userId;
  try {
    const updatedMessage = await Message.findOneAndUpdate(
      {
        _id: messageId,
        senderId,
      },
      { content, images, files, status: "edited" },
      { new: true }
    );

    if (!updatedMessage) {
      return res
        .status(400)
        .json({ message: "Not found message or this is not yours." });
    }
    return res.status(200).json({ message: updatedMessage });
  } catch (error) {
    console.log("updateMessage error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  const senderId = req.userId;
  const messageId = req.params.messageId;

  try {
    const message = await Message.findOneAndDelete(
      {
        _id: messageId,
        senderId,
      },
      { new: true }
    );
    if (!message) {
      return res
        .status(400)
        .json({ message: "Not found message or this is not yours." });
    }

    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log("deleteMessage error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllMessagesInOneRoom = async (req, res) => {
  const senderId = req.userId;
  const receiverId = req.params.receiverId;

  if (typeof receiverId === "undefined") {
    return res.status(400).json({ message: "id is required." });
  }

  try {
    const findQuery = {
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    };
    const messages = await Message.find(findQuery).sort({
      createdAt: 1,
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log("getAllmessagesInOneRoom", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.setMessagesAsRead = async (req, res) => {
  const userId = req.userId;
  const { messageIds } = req.body;
  if (!messageIds) {
    return res.status(400).json({ message: "Bad Request" });
  }

  // Convert to Array
  const msgIds = Array.isArray(messageIds) ? messageIds : [messageIds];

  // Filter valid ids.
  const validIds = msgIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

  try {
    const findQuery = {
      _id: {
        $in: validIds,
      },
      receiverId: userId,
    };
    const readMessages = await Message.updateMany(findQuery, { isRead: true });
    console.log("readMessages", readMessages);

    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log("setMessageMarkAsRead error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getUnreadMessages = async (req, res) => {
  const userId = req.userId;

  try {
    const findQuery = { receiverId: userId, isRead: false };
    const unReadMessageCount = await Message.countDocuments(findQuery);

    return res.status(200).json({ unReadMessageCount });
  } catch (error) {
    console.log("getUnreadmessages error", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.uploadMessageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Uploading failed" });
    }
    return res.json({location: req.file?.location});
  } catch (error) {
    console.log("uploadMessageImage error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// ============== Connections controllers ==============

exports.addConnection = async (req, res) => {
  const userId = req.userId;
  const userRole = req.userRole;

  const { receiverId, receiverRole } = req.body;

  try {
    const query = {
      senderId: userId,
      senderRole: userRole,
      receiverId,
      receiverRole,
    };

    const query_reversed = {
      senderId: receiverId,
      senderRole: receiverRole,
      receiverId: userId,
      receiverRole: userRole,
    };

    const isExisting = await MessageConnection.findOne(query);
    const isExistingRe = await MessageConnection.findOne(query_reversed);

    if (isExisting && isExistingRe) {
      return res.status(400).json({ message: "You are already connected!" });
    } else if (isExisting && !isExistingRe) {
      await MessageConnection.create(query_reversed);
    } else if (!isExisting && isExistingRe) {
      await MessageConnection.create(query);
    } else {
      await MessageConnection.create(query);
      await MessageConnection.create(query_reversed);
    }
    return res.status(201).json({ message: "success" });
  } catch (error) {
    console.log("addConnection error:", error);
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllConnections = async (req, res) => {
  const userId = req.userId;
  try {
    const connections = await MessageConnection.find({ senderId: userId });
    const connectedUsers = [];
    const promises = connections?.map(async (connection) => {
      let user;
      console.log("roles", connection.receiverRole);
      switch (connection.receiverRole) {
        case "tabletUser":
          user = await MerchantUser.findById(connection.receiverId);
          break;
        case "vendor":
          user = await Vendor.findById(connection.receiverId);
          break;
        case "shopper":
          user = await Shopper.findById(connection.receiverId);
          break;
      }
      if (!user) {
        return;
      }
      const objectUser = user.toObject();
      const userInfo = {};
      userInfo.firstName = objectUser.firstName || "";
      userInfo.lastName = objectUser.lastName || "";
      userInfo.avatar = objectUser.avatar;
      userInfo._id = objectUser._id;
      userInfo.userRole = connection.receiverRole;

      const findQuery = {
        $or: [
          { senderId: connection.senderId, receiverId: connection.receiverId },
          { senderId: connection.receiverId, receiverId: connection.senderId },
        ],
      };
      const lastMessage = await Message.findOne(findQuery).sort({
        createdAt: -1,
      });
      if (lastMessage) {
        userInfo.lastMessage = lastMessage.toObject();
      }
      connectedUsers.push(userInfo);
    });

    await Promise.all(promises);

    return res.status(200).json({ connectedUsers });
  } catch (error) {
    console.log("getAllConnections error", error);
    return res.status(500).json({ message: error.message });
  }
};
