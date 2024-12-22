import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {toast} from "react-toastify";
import {fetchAllChats} from '../../src/api/message/chat'
import axiosInstance from "src/utils/axios.js";
import {BASE_URL} from "src/config-global.js";

const initialState = {
	chatContacts: [],
	chatLog: [],
	selectedContact: {},
	isChatLogLoading: false,
	searchedContact: [],
	
	chats: [],
	activeChat: '',
	isLoading: false,
	notifications: [],
};

export const fetchContacts = createAsyncThunk("chat/fetchContacts", async (tab) => {
	try {
		const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/messages/chat-contacts?tab=${tab}`);
		return data;
	} catch (error) {
		toast(error.message || `Error on getting contacts`, {
			type: 'error',
			className: 'toast-custom',
		});
		throw error;
	}
});

export const fetchChatLog = createAsyncThunk("chat/fetchChatLog", async (chatId) => {
	try {
		const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/messages/chat-logs?chatId=${chatId}`);
		return data;
	} catch (error) {
		toast(error.message || `Error on getting contacts`, {
			type: 'error',
			className: 'toast-custom',
		});
		throw error;
	}
});

export const getSearchedContact = createAsyncThunk("chat/searchContacts", async (search) => {
	try {
		const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/messages/search-contact?search=${search}`);
		return data;
	} catch (error) {
		toast(error.message || `Error on getting contacts`, {
			type: 'error',
			className: 'toast-custom',
		});
		throw error;
	}
});



export const fetchChats = createAsyncThunk('redux/chats', async ({token, userId, userType}) => {
	try {
		const data = await fetchAllChats(token, userId, userType);
		return data;
	} catch (error) {
		toast.error('Something went wrong in fetch chats', error)
	}
})

const chatsSlice = createSlice({
	name: 'chats',
	initialState,
	reducers: {
		setCurrentContact: (state, {payload}) => {
			state.selectedContact = payload;
		},
		setActiveChat: (state, {payload}) => {
			state.activeChat = payload;
		},
		setNotifications: (state, {payload}) => {
			state.notifications = payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchChats.pending, (state) => {
			state.isLoading = true;
		},)
			.addCase(fetchChats.fulfilled, (state, {payload}) => {
				state.chats = payload;
				state.isLoading = false;
			})
			.addCase(fetchChats.rejected, (state) => {
				state.isLoading = false;
			})
			
			.addCase(fetchContacts.pending, (state) => {
				state.isLoading = true;
			},)
			.addCase(fetchContacts.fulfilled, (state, {payload}) => {
				state.chatContacts = payload;
				state.isLoading = false;
			})
			.addCase(fetchContacts.rejected, (state) => {
				state.isLoading = false;
			})
			
			.addCase(fetchChatLog.pending, (state) => {
				state.isChatLogLoading = true;
			},)
			.addCase(fetchChatLog.fulfilled, (state, {payload}) => {
				state.chatLog = payload;
				state.isChatLogLoading = false;
			})
			.addCase(fetchChatLog.rejected, (state) => {
				state.isChatLogLoading = false;
			})
			
			.addCase(getSearchedContact.pending, (state) => {
				state.isChatLogLoading = true;
			},)
			.addCase(getSearchedContact.fulfilled, (state, {payload}) => {
				state.searchedContact = payload;
				state.isChatLogLoading = false;
			})
			.addCase(getSearchedContact.rejected, (state) => {
				state.isChatLogLoading = false;
			})
	}
});

export const {setActiveChat, setNotifications, setCurrentContact} = chatsSlice.actions;
export default chatsSlice.reducer;