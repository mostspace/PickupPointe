const SocketService = require('../socket/socketService');
const { NOTIFY } = require('../socket/constants');

class NotificationService {
    static async sendNotificationToUser(userId, notification) {
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
    }
}

module.exports = NotificationService;
