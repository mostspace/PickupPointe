import axios from "axios";
import { BASE_URL } from "src/config-global";

const API = (token) => 
    axios.create({
        baseURL: BASE_URL,
        headers: { Authorization: token }
    });

export const accessCreate = async ({token, body}) => {
    try {
        const { data } = await API(token).post('/api/v1/rtchat', body);
        console.log(data);
        return data;
    } catch (error) {
        console.log('error in access create api', error);
    }
}

export const fetchAllChats = async (token, userId, userType) => {
    try {
        const { data } = await API(token).get('/api/v1/rtchat', { params: { userId, userType } });
        return data;
    } catch (error) {
        console.log('error in fetch all chats api', error);
    }
}

export const deleteChat = async ({token, chatId}) => {
    try {
        const { data } = await API(token).delete(`/api/v1/rtchat/${chatId}`);
        return data;
    } catch (error) {
        console.log('error in fetch all chats api', error);
    }
}