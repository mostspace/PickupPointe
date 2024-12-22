// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getUsers(params) {
    const payload = {
        locations: params.locations
    }
    const newParams = {
        ...params
    }
    delete newParams.locations
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.vendor.list}`, payload, { params: newParams });
    return res.data;
}

export async function addUser(payload) {
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.vendor.user}`, payload);
    return res.data;
}

export async function editUser(userId, payload) {
    const res = await axiosInstance.patch(`${BASE_URL}${endpoints.vendor.user}/${userId}`, payload);
    return res.data;
}

export async function resetPassword(userId) {
    const res = await axiosInstance.patch(`${BASE_URL}${endpoints.vendor.user}/${userId}/reset-password`);
    return res.data;
}

export async function changePassword(userId, payload) {
    const res = await axiosInstance.patch(`${BASE_URL}${endpoints.vendor.user}/${userId}/change-password`, payload);
    return res.data;
}