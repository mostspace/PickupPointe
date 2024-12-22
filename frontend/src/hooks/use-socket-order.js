import { useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { SOCKET_EVENTS } from '../constants/socketEvents';

export const useSocketOrder = (orderId, onStatusChange) => {
	const socket = useSocket();
	useEffect(() => {

	})
	/*useEffect(() => {
		if (orderId) {
			socket.emit(SOCKET_EVENTS.ORDER.TRACK_ORDER, orderId);

			socket.on(SOCKET_EVENTS.ORDER.STATUS_CHANGED, onStatusChange);
		}

		return () => {
			socket.off(SOCKET_EVENTS.ORDER.STATUS_CHANGED);
		};
	}, [socket, orderId, onStatusChange]);

	const updateOrderStatus = useCallback((status) => {
		socket.emit(SOCKET_EVENTS.ORDER.UPDATE_STATUS, {
			orderId,
			status
		});
	}, [socket, orderId]);

	return { updateOrderStatus };*/
};