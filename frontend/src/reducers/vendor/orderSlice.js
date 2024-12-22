import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  order: {},
  isLoading: false,
  orderList: {
    result: [],
    totalCount: 0,
    page: 0,
  },
  orderCalendar: {
    result: [],
    serviceData: []
  },
  serviceTimeDetail: {},
  orderDetail: {}
};

export const placeOrder = createAsyncThunk('redux/order', async ({formData}) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/order`, formData);
    return data;
  } catch (error) {
    toast(`Error on placing an order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const saveServiceAvailability = createAsyncThunk("vendor/saveServiceAvailability", async (formData) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/vendor/order/save_service_availability`, formData);
    return data
  } catch (err) {
    toast(`Error on saving service availability`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw err;
  }
})

export const getOrders = createAsyncThunk('redux/vendor/getOrder', async (pagination) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/vendor/orders`, {params: pagination});
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const getOrderById = createAsyncThunk('redux/getOrderById', async (id) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/vendor/order/${id}`);
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const getOrderCalendar = createAsyncThunk("vendor/orderCalendar", async (params) => {
  try {
    const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/vendor/get_order_calendar`, {params});
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

const orderSlice = createSlice({
  name: 'vendorOrders',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {state.isLoading = true})
      .addCase(placeOrder.fulfilled, (state, { payload }) => {
        state.order = payload;
        state.isLoading = false;
      })
      .addCase(placeOrder.rejected, (state) => {state.isLoading = false})

      .addCase(getOrders.pending, (state) => {state.isLoading = true})
      .addCase(getOrders.fulfilled, (state, { payload }) => {
        state.orderList = payload;
        state.isLoading = false;
      })
      .addCase(getOrders.rejected, (state) => {state.isLoading = false})

      .addCase(getOrderById.pending, (state) => {state.isLoading = true})
      .addCase(getOrderById.fulfilled, (state, { payload }) => {
        state.orderDetail = payload;
        state.isLoading = false;
      })
      .addCase(getOrderById.rejected, (state) => {state.isLoading = false})

      .addCase(getOrderCalendar.pending, (state) => {state.isLoading = true})
      .addCase(getOrderCalendar.fulfilled, (state, { payload }) => {
        state.orderCalendar = payload;
        state.isLoading = false;
      })
      .addCase(getOrderCalendar.rejected, (state) => {state.isLoading = false})

      .addCase(saveServiceAvailability.pending, (state) => {state.isLoading = true})
      .addCase(saveServiceAvailability.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.serviceTimeDetail = payload;
      })
      .addCase(saveServiceAvailability.rejected, (state) => {state.isLoading = false})
  }
});

export default orderSlice.reducer;