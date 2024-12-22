const SocketService = require('./index');

class ChatService {
    /* static async broadcastToRoom(roomId, message) {
        try {
            SocketService.getIO().to(roomId).emit(CHAT.RECEIVE_MESSAGE, {
                roomId,
                message,
                timestamp: new Date()
            });
            return true;
        } catch (error) {
            console.error('Chat broadcast error:', error);
            throw error;
        }
    } */
}

module.exports = ChatService;