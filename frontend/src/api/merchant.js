// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function merchantLogin(payload) {
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.merchant.login}`, payload);
    return res.data;
}

export async function sendFeedback(payload) {
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.merchant.sendFeedback}`, payload);
    return res.data;
}