class SocketService {
    static io;
    static userSockets = new Map();
    
    static setIO(ioInstance) {
        SocketService.io = ioInstance;
    }

    static getIO() {
        if (!SocketService.io) {
            throw new Error('Socket.io not initialized');
        }
        return SocketService.io;
    }
    
    static setUserSocket (userId, socketId) {
        this.userSockets.set(userId, socketId);
    }
    static removeUserSocket (userId) {
        this.userSockets.delete(userId);
    }
    
    static getSocketByUserId(userId) {
        const socketId = this.userSockets.get(userId);
        if (!socketId) {
            return null;
        }
        const socket = this.io.sockets.sockets.get(socketId);
        return socket || null;
    }

    static emitToUser(userId, event, data) {
        const socket = this.getSocketByUserId(userId);
        if (socket) {
            socket.emit(event, data);
            return true;
        }
        return false;
    }

    static emitToUsers(userIds, event, data) {
        userIds.forEach(userId => {
            this.emitToUser(userId, event, data);
        });
    }
}

module.exports = SocketService;
