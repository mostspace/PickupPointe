import { BASE_URL } from "src/config-global";
import axiosInstance, { endpoints } from "src/utils/axios";

export async function createSubscription(payload) {
  const res = await axiosInstance.post(`${BASE_URL}${endpoints.subscription.create}`, payload);
  return res;
}

export async function updateSubscription(payload, id) {
  const res = await axiosInstance.patch(`${BASE_URL}${endpoints.subscription.update}/${id}`, payload);
  return res;
}