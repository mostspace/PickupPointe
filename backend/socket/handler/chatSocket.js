const SocketService = require('../service');
const {saveChatLog, deleteMessage, createChat, deleteChat, getContacts, blockChat, muteChat, archiveChat} = require("./model/chatModel");

const refreshContacts = (userId) => {
	getContacts(userId)
		.then(contacts => {
			SocketService.emitToUser(userId, "chat.refresh_contacts", {contacts});
		})
		.catch (err => console.log(err))
}

const chatSocketHandler = (io, socket) => {
	socket.on("chat.set_chat_id", ({chatId, opponentId}) => {
		socket.chatInfo = {
			...socket.chatInfo,
			chatId,
			opponentId
		};
	});
	
	socket.on("chat.typing", (isTyping) => {
		if (socket.chatInfo) {
			SocketService.emitToUser(socket.chatInfo?.opponentId, "chat.typing", {
				user: socket.userId,
				status: isTyping
			});
		}
	});
	
	socket.on("chat.message", ({message, fileLocation}) => {
		if (socket.chatInfo) {
			saveChatLog(socket.chatInfo.chatId, message, fileLocation, socket.userId, socket.userRole)
				.then(({chat, newMessage}) => {
					SocketService.emitToUsers([socket.userId, socket.chatInfo.opponentId], "chat.new_message", {
						chatId: chat._id,
						lastMessage: message,
						lastUpdatedAt: chat.updatedAt,
						newMessage: newMessage,
						senderId: socket.userId,
						receiverId: socket.chatInfo.opponentId
					});
				});
		}
	});
	
	socket.on("chat.delete_message", ({chatId, messageId}) => {
		if (socket.chatInfo) {
			deleteMessage(chatId, messageId)
				.then(data => {
					SocketService.emitToUsers([socket.userId, socket.chatInfo.opponentId], "chat.delete_message", {...data})
				});
		}
	});
	
	socket.on("chat.add_new", ({_id, role}) => {
		if (_id && role) {
			createChat({_id, role}, {_id: socket.userId, role: socket.userRole})
				.then(data => {
					SocketService.emitToUser(socket.userId, "chat.refresh_contacts", {});
					refreshContacts(_id);
				})
				.catch (error => {
					console.log(error);
				})
		}
	});
	
	socket.on("chat.delete_chat", ({chatId}) => {
		deleteChat(chatId, socket.userId)
			.then(data => {
				if (data) {
					refreshContacts(socket.userId);
					SocketService.emitToUser(socket.userId, "chat.delete_chat", {chatId});
					refreshContacts(socket.chatInfo.opponentId);
				}
			})
			.catch (err => console.log(err));
	});
	
	socket.on("chat.block_chat", ({chatId, isBlock}) => {
		blockChat(chatId, socket.userId, isBlock)
			.then(data => {
				if (data) {
					refreshContacts(socket.userId);
					// SocketService.emitToUser(socket.userId, "chat.delete_chat", {chatId});
					refreshContacts(socket.chatInfo.opponentId);
				}
			})
			.catch (err => console.log(err));
	});
	
	socket.on("chat.mute_chat", ({chatId, isMute}) => {
		muteChat(chatId, socket.userId, isMute)
			.then(data => {
				if (data) {
					refreshContacts(socket.userId);
					// SocketService.emitToUser(socket.userId, "chat.delete_chat", {chatId});
					refreshContacts(socket.chatInfo.opponentId);
				}
			})
			.catch (err => console.log(err));
	});
	
	socket.on("chat.archive_chat", ({chatId, isArchive}) => {
		archiveChat(chatId, socket.userId, isArchive)
			.then(data => {
				if (data) {
					refreshContacts(socket.userId);
					// SocketService.emitToUser(socket.userId, "chat.delete_chat", {chatId});
					refreshContacts(socket.chatInfo.opponentId);
				}
			})
			.catch (err => console.log(err));
	});
	
	/*socket.on('chat.setup', (userData) => {
		try {
			socket.join(userData._id);
			socket.emit("chat.connected");
		} catch (error) {
			console.log("setup error", error)
		}
	});
	socket.on('chat.join_room', (room) => {
		socket.join(room);
	});
	socket.on("chat.typing", (room) => socket.in(room).emit("chat.typing"))
	socket.on('chat.stop_typing', (room) => socket.in(room).emit('chat.stop_typing'));
	socket.on('chat.new_message', (newMessageRecieve) => {
		try {
			let chat = newMessageRecieve.chatId;
			if (!chat.users) console.log('chats.users is not defined');
			console.log(chat.users, newMessageRecieve.sender._id);
			chat.users.forEach((user) => {
				if (user.userId == newMessageRecieve.sender._id) return;
				socket.in(user.userId).emit('chat.message_received', newMessageRecieve);
			});
		} catch (error) {
			console.log("chat.new_message_error", error)
		}
	});
	socket.on('chat.delete_message', (data) => {
		try {
			let chat = data.chatId;
			if (!chat.users) console.log('chats.users is not defined');
			chat.users.forEach((user) => {
				if (user.userId == data.sender._id) return;
				socket.in(user.userId).emit('chat.message_deleted');
			});
		} catch (error) {
			console.log("Delete message error", error)
		}
	});
	socket.on('chat.delete_chat', (data) => {
		try {
			console.log('delete chat', JSON.stringify(data))
			data.users.forEach((user) => {
				socket.in(user.userId).emit('chat.chat_deleted');
			});
		} catch (error) {
			console.log("Delete chat error", error)
		}
	});*/
};

module.exports = chatSocketHandler;
