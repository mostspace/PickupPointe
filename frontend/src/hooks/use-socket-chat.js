import { useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export const useSocketChat = (roomId) => {
	const socket = useSocket();

	useEffect(() => {
		if (roomId) {
			socket.emit(SOCKET_EVENTS.CHAT.JOIN_ROOM, roomId);
		}
	}, [roomId, socket]);

	const sendMessage = useCallback((message) => {
		socket.emit(SOCKET_EVENTS.CHAT.SEND_MESSAGE, {
			roomId,
			message,
			timestamp: new Date()
		});
	}, [socket, roomId]);

	return { sendMessage };
};