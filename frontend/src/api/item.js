import axios from 'axios';

// export const api = axios.create({
//   baseURL: "https://stag-api.pickuppointe.com"
// })

export const addItem = (data) => {
  return api.post("/api/v1/item", data);
}

// export const getAllItems = ({ categories }) => {
//   return api.post("/api/v1/item", { categories });
// }

export const getItem = (id) => {
  return api.get(`/api/v1/item/${id}`);
}

// export const updateItem = (id, data) => {
//   return api.put(`/api/v1/item/${id}`, data);
// }

// export const removeItem = (id) => {
//   return api.delete(`/api/v1/item/${id}`);
// }

// export const addItemCategory = (data) => {
//   return api.post("/api/v1/item-category", data);
// }

// export const getAllItemCategories = () => {
//   return api.get("/api/v1/item-category");
// }

// export const removeItemCategory = (id) => {
//   return api.delete(`/api/v1/item-category/${id}`);
// }

// export const updateItemCategory = (id, data) => {
//   return api.put(`/api/v1/item-category/${id}`, data);
// }