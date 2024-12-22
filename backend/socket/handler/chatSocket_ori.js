
const chatSocketHandler = (io, socket) => {
	socket.on('chat.setup', (userData) => {
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
	});
};

module.exports = chatSocketHandler;
