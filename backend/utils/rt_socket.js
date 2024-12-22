const Server = require("socket.io");

const socketHandler = (server) => {
    const io = new Server.Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: "*",
        },
    });

    io.on('connection', (socket) => {
        socket.on('setup', (userData) => {
            try {
                socket.join(userData._id);
                socket.emit("connected");
            } catch (error) {
                console.log("setup error", error)
            }
        });
        socket.on('chat.join_room', (room) => {
            socket.join(room);
        });
        socket.on('chat.typing', (room) => socket.in(room).emit('typing'));
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
        socket.on('chat.new_message', (newMessageRecieve) => {
            try {
                console.log("chat.new_message", JSON.stringify(newMessageRecieve))
                let chat = newMessageRecieve.chatId;
                console.log(chat);
                if (!chat.users) console.log('chats.users is not defined');
                chat.users.forEach((user) => {
                    if (user.userId == newMessageRecieve.sender._id) return;
                    socket.in(user.userId).emit('chat.message_received', newMessageRecieve);
                });
            } catch (error) {
                console.log("chat.new_message_error", error)
            }
        });
        socket.on('delete message', (data) => {
            try {
                console.log('delete message', JSON.stringify(data))
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
    });
}

module.exports = socketHandler;
