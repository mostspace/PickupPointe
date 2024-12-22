// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getShop(shopId) {
    const res = await axiosInstance.get(`${BASE_URL}${endpoints.shop.get_by_id}/${shopId}`);
    return res;
}

export async function getShops() {
    const res = await axiosInstance.get(`${BASE_URL}${endpoints.vendor.shop.list}`);
    const data = await res.data;
    return data;
}

export async function addShop(payload) {
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.vendor.shop.shop}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    },);
    return res.data;
}

export async function updateShop(id, payload) {
    const res = await axiosInstance.patch(`${BASE_URL}${endpoints.vendor.shop.shop}/${id}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    },);
    return res;
}

export async function deleteShop(id) {
    const res = await axiosInstance.delete(`${BASE_URL}${endpoints.vendor.shop.shop}/${id}`);
}
