// utils
import { BASE_URL } from "src/config-global";
import axiosInstance, { endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

export async function createPaymentIntent(payload) {
  const res = await axiosInstance.post(
    `${BASE_URL}${endpoints.shopper.payment_intent}`,
    payload
  );
  const data = await res.data;
  console.log("createPaymentIntent", res, data);
  return data;
};

export async function checkCard(payload) {
  const res = await axiosInstance.post(
    `${BASE_URL}${endpoints.payment.check_card}`,
    payload
  );
  const {data} = res;
  console.log("Hello, check card", res, data);
  return data;
};

export async function createPaymentMethod(payload) {
  const res = await axiosInstance.post(
    `${BASE_URL}${endpoints.payment.create_payment_method}`,
    payload
  );
  const {data} = res;
  console.log("Hello create payment method", res, data);
  return data;
}