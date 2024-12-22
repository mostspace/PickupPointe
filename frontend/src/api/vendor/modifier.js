
// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function addModifier(params) {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
        if (key === 'photos') {
            params[key].forEach(photo => {
                formData.append(key, photo)
            })
        } else if (key === 'items') {
            formData.append(key, JSON.stringify(params[key]))
        } else {
            formData.append(key, params[key])
        }
    })
    const res = await axiosInstance.post(`${BASE_URL}${endpoints.modifier.add}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}

export async function updateModifier(params, id) {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
        if (key === 'photos') {
            params[key].forEach(photo => {
                formData.append(key, photo)
            })
        } else if (key === 'items') {
            formData.append(key, JSON.stringify(params[key]))
        } else {
            formData.append(key, params[key])
        }
    })
    const res = await axiosInstance.put(`${BASE_URL}${endpoints.modifier.update}?id=${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return res.data;
}

export async function removeModifier(id) {
    const res = await axiosInstance.delete(`${BASE_URL}${endpoints.modifier.remove}?id=${id}`);
    return res.data;
}

export async function getModifiers() {
    const res = await axiosInstance.get(`${BASE_URL}${endpoints.modifier.list}`);
    return res.data;
}