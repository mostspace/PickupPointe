const SocketService = require('./index');

class OrderService {
    static async broadcastUpdatedStock(itemId, locationId) {
        
    }
    /*static async sendNotificationToUser(userId, notification) {
        try {
            SocketService.getIO().to(userId).emit(NOTIFY.RECEIVE_NOTIFICATION, {
                userId,
                ...notification,
                timestamp: new Date()
            });

            return true;
        } catch (error) {
            console.error('Notification error:', error);
            throw error;
        }
    }*/
}

module.exports = OrderService;
