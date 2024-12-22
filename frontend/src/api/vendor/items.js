// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getItems(params) {
    const { categories, locations, searchKey, pageSize, page } = params
    const res = await axiosInstance.post(
        `${BASE_URL}${endpoints.items.list}`, 
        { categories, locations }, 
        {
            params: {
                searchKey,
                pageSize,
                page
            },
        }
    );
    return res.data;
}

export async function addItem(payload) {
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.items.item}`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return res.data;
}