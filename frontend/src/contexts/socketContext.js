import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import {BASE_URL} from "../config-global.js";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const state = useSelector((state) => state);
	const user = state.auth.user || state.merchant.auth.merchant;
	const role = state.auth.user ? state.auth.type : state.merchant.auth ? "merchant" : "guest";
	
	useEffect(() => {
		const newSocket = io(BASE_URL, {
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
		});
		
		setSocket(newSocket);
		
		const setUser = () => {
			if (user?._id) {
				newSocket.emit('set_user', { id: user._id, role });
			}
		};
		
		newSocket.on('connect', setUser);
		newSocket.on('reconnect', setUser);
		
		return () => {
			newSocket.close();
		};
	}, [user?._id]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => {
	const socket = useContext(SocketContext);
	if (!socket) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return socket;
};