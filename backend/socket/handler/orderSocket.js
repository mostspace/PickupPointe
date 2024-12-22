const {cache} = require("../../utils/cache");

const orderSocketHandler = (io, socket) => {
	socket.on("order.get_current_stock", (key) => {
		socket.emit(`order.current_stock.${key}`, cache.get(`${key}`) || 0);
	});
	// socket.on("order.get_current_stock", ({item, location}) => {
	// 	console.log(socket);
	// })
};

module.exports = orderSocketHandler;