// utils
import { BASE_URL } from 'src/config-global';
import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export async function getNotificationSettings() {
    const res = await axiosInstance.get(`${BASE_URL}${endpoints.shopper.get_notification}`);
    const data = await res.data;
    return data;
}

export async function setNotificationSettings(payload) {
    const res = await axiosInstance.put(`${BASE_URL}${endpoints.shopper.set_notification}`, payload, {
        headers: {
            'Content-Type': 'application/json',
        }
    },);
    console.log("res", res)
}

export async function getShopCategories() {
    const res = await axiosInstance.get(`${BASE_URL}${endpoints.shopper.shop_category_list}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    },);
    console.log("res", res)
    return res.data;
}

export async function getShopperSetting() {
    try {
        const res = await axiosInstance.get(`${BASE_URL}${endpoints.shopper.setting}`);
        return res.data;
    } catch(error) {
        console.log(error);
        return undefined;
    }

}