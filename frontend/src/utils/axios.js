import axios from 'axios';
// config
import { HOST_API } from 'src/config-global';

const API_LEVEL = '/api/v1';
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage or any other storage
    const token = localStorage.getItem('token'); // or use Redux store or cookies

    if (token) {
      // Set the Authorization header for the request
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  vendor: {
    list: '/api/v1/vendor/tablet-user/all',
    user: '/api/v1/vendor/tablet-user',
    shop: {
      list: '/api/v1/vendor/shop/all',
      shop: '/api/v1/vendor/shop',
    }
  },
  merchant: {
    login: '/api/v1/merchant/auth/login',
    sendFeedback: "/api/v1/merchant/settings/feedback"
  },
  modifier: {
    list: '/api/v1/modifier/get-modifiers',
    add: '/api/v1/modifier/add-modifier',
    remove: '/api/v1/modifier/remove-modifier',
    update: '/api/v1/modifier/update-modifier'
  },
  items: {
    list: '/api/v1/item/all',
    item: '/api/v1/item',
  },
  shopper: {
    get_notification: "/api/v1/shopper/get-notification-setting",
    set_notification: "/api/v1/shopper/set-notification-setting",
    update_profile: "/api/v1/shopper/update-profile",
    upload_avatar: "/api/v1/shopper/upload-avatar",
    change_password: "/api/v1/shopper/change-password",
    payment_intent: "/api/v1/order/create-payment-intent",
    shop_category_list: "/api/v1/shop/shop-category",
    setting: "/api/v1/shopper/get-setting"
  },
  shop: {
    get_by_id: `${API_LEVEL}/shop/`
  },
  subscription: {
    create: `${API_LEVEL}/subscription`,
    update: `${API_LEVEL}/subscription`,
  },
  payment: {
    check_card: `${API_LEVEL}/payment/check-card`,
    create_payment_method: `${API_LEVEL}/payment`
  }
};