const Server = require("socket.io");

const orderSocketHandler = require('./handler/orderSocket');
const notifySocketHandler = require('./handler/notifySocket');
const chatSocketHandler = require('./handler/chatSocket');

const SocketService = require('./service');

const socketHandler = (server) => {
	const io = new Server.Server(server, {
		cors: {
			origin: "*",
		},
	});

	SocketService.setIO(io);

	io.on('connection', (socket) => {
		socket.userId = socket.id;
		socket.on("set_user", (user) => {
			if (user) {
				socket.userId = user.id;
				socket.userRole = user.role
			}
			SocketService.setUserSocket(user.id, socket.id);
		})
		orderSocketHandler(io, socket);
		notifySocketHandler(io, socket);
		chatSocketHandler(io, socket);

		socket.on('disconnect', () => {
			SocketService.removeUserSocket(socket.userId);
		});
	});
};

module.exports = socketHandler;