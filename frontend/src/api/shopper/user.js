// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function updateProfile(payload) {
    const res = await axiosInstance.patch(`${BASE_URL}${endpoints.shopper.update_profile}`, payload);
    return res.data;
}

export async function uploadAvatar(payload) {
    const res = await axiosInstance.patch(`${BASE_URL}${endpoints.shopper.upload_avatar}`, payload);
    return res.data;
}

export async function changePassword(payload) {
    const res = await axiosInstance.put(`${BASE_URL}${endpoints.shopper.change_password}`, payload);
    return res.data;
}