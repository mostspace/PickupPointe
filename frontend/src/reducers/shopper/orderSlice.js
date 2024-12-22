import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  order: {},
  orderList: {
    result: [],
    totalCount: 0,
    page: 0
  },
  activeOrders: [],
  deliveryInfo: {},
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
})

export const withdrawOrder = createAsyncThunk("shopper/withdrawOrder", async (id) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/shopper/withdraw_order/${id}`);
    return data;
  } catch (err) {
    console.log(err);
    toast(`Error on withdraw an order`, {type: 'error', className: 'toast-custom',});
    throw err;
  }
})

export const getOrders = createAsyncThunk('redux/shopper/getOrder', async (pagination) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/shopper/orders`, {params: pagination});
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
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/shopper/order/${id}`);
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const getActiveOrders = createAsyncThunk('redux/shopper/getActiveOrders', async (id) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/shopper/get_active_orders`);
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const getDeliveryFee = createAsyncThunk("redux/shopper/getDeliveryFee", async (params) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/delivery/door-dash-quote`, params);
    return data;
  } catch (error) {
    console.log(error)
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

const orderSlice = createSlice({
  name: 'shopperOrders',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(placeOrder.fulfilled, (state, { payload }) => {
        state.order = payload;
        state.isLoading = false;
      })
      .addCase(placeOrder.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(getOrders.fulfilled, (state, { payload }) => {
        state.orderList = payload;
        state.isLoading = false;
      })
      .addCase(getOrders.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, { payload }) => {
        state.orderDetail = payload;
        state.isLoading = false;
      })
      .addCase(getOrderById.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(withdrawOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(withdrawOrder.fulfilled, (state, { payload }) => {
        state.orderDetail = payload;
        state.isLoading = false;
      })
      .addCase(withdrawOrder.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getActiveOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveOrders.fulfilled, (state, { payload }) => {
        state.activeOrders = payload;
        state.isLoading = false;
      })
      .addCase(getActiveOrders.rejected, (state) => {
        state.isLoading = false;
      })
      
      .addCase(getDeliveryFee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDeliveryFee.fulfilled, (state, { payload }) => {
        state.deliveryInfo = payload;
        state.isLoading = false;
      })
      .addCase(getDeliveryFee.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export default orderSlice.reducer;