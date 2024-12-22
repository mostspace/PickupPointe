import axios from 'axios';
import { BASE_URL } from 'src/config-global';

const API = (token) =>
  axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: token },
  });

export const sendMessage = async ({token, body}) => {
    try {
        const { data } = await API(token).post('/api/v1/rtmessage/', body, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        return data;
    } catch (error) {
        console.log('error in sendmessage api', error);
    }
}

export const fetchMessages = async ({id, token, senderModel}) => {
    try {
      const { data } = await API(token).get(`/api/v1/rtmessage/${id}/${senderModel}`);
      return data;
    } catch (error) {
      console.log('error in fetch Message API ', error);
    }
};

export const deleteMessage = async ({token, messageId}) => {
  try {
    const { data } = await API(token).delete(`/api/v1/rtmessage/${messageId}`);
    return data;
  } catch (error) {
    console.log('error in fetch Message API ', error);
  }
};