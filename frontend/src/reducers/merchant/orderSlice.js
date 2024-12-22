import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  isLoading: false,
  orderList: {
    result: [],
    totalCount: 0,
    page: 0
  },
  orderDetail: {},
  replaceableItems: [],
};


export const getOrders = createAsyncThunk('redux/merchant/getOrder', async (pagination) => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/merchant/order/list`, {params: pagination});
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const getOrderById = createAsyncThunk('redux/merchant/getOrderById', async (id) => {
  try {
    const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/merchant/order/item/${id}`);
    return data;
  } catch (error) {
    toast(`Error on fetching order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const makeItemOutOfStock = createAsyncThunk("merchant/makeItemOutOfStock", async (params) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/order/out_of_stock`, params);
    return data;
  } catch (error) {
    toast(`Error while making item out of stock`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const confirmOrder = createAsyncThunk('redux/merchant/confirmOrder', async ({id, pickupTime}) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/order/confirm_order/${id}`, {pickupTime});
    return data;
  } catch (error) {
    toast(`Error while confirming order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const cancelOrderById = createAsyncThunk('redux/merchant/cancelOrderById', async (id) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/order/cancel_order/${id}`);
    return data;
  } catch (error) {
    toast(`Error while canceling order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const refundItem = createAsyncThunk('redux/merchant/refundItem', async (params) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/order/refund_order_item/${params.orderId}`, params);
    return data;
  } catch (error) {
    toast(`Error while canceling order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});


export const getReplaceableItems = createAsyncThunk('redux/merchant/getReplaceableItems', async (categories) => {
  try {
    console.log(categories)
    const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/merchant/order/replaceable_items`, {params: {categories}});
    return data;
  } catch (error) {
    toast(`Error on fetching order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const replaceItem = createAsyncThunk('redux/merchant/replaceItem', async (params) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/order/replace_item`, params);
    return data;
  } catch (error) {
    toast(`Error on fetching order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const confirmDelivery = createAsyncThunk('redux/merchant/replaceItem', async (id) => {
  try {
    const {data} = await axiosInstance.post(`${BASE_URL}/api/v1/delivery/door-dash-quote/${id}/accept`);
    return data;
  } catch (error) {
    toast(`Error on confirming order`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

const orderSlice = createSlice({
  name: 'merchantOrder',
  initialState,
  extraReducers: (builder) => {
    builder
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
      },)
      .addCase(getOrderById.fulfilled, (state, { payload }) => {
        state.orderDetail = payload;
        state.isLoading = false;
      })
      .addCase(getOrderById.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getReplaceableItems.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(getReplaceableItems.fulfilled, (state, { payload }) => {
        state.replaceableItems = payload;
        state.isLoading = false;
      })
      .addCase(getReplaceableItems.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(confirmOrder.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(confirmOrder.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(confirmOrder.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(makeItemOutOfStock.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(makeItemOutOfStock.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(makeItemOutOfStock.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(cancelOrderById.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(cancelOrderById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(cancelOrderById.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export default orderSlice.reducer;