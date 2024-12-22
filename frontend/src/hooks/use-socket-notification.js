import { useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export const useSocketNotification = (onNotification) => {
	const socket = useSocket();

	useEffect(() => {
		socket.on(SOCKET_EVENTS.NOTIFY.RECEIVE_NOTIFICATION, onNotification);

		return () => {
			socket.off(SOCKET_EVENTS.NOTIFY.RECEIVE_NOTIFICATION);
		};
	}, [socket, onNotification]);

	const sendNotification = useCallback((userId, notification) => {
		socket.emit(SOCKET_EVENTS.NOTIFY.SEND_NOTIFICATION, {
			userId,
			...notification
		});
	}, [socket]);

	return { sendNotification };
};