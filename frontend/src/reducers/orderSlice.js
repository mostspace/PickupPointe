import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
    order: {},
    orderList: [],
    orderDetail: {}
};

export const placeOrder = createAsyncThunk('redux/order', async ({formData}) => {
    try {
        const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/order`, formData);
        return data;
    } catch (error) {
        toast(error.message || `Error on placing an order`, {
            type: 'error',
            className: 'toast-custom',
        });
        throw error;
    }
})

export const getOrders = createAsyncThunk('redux/getOrder', async (pagination) => {
    try {
        const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/order`, {params: pagination});
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
        const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/order/${id}`);
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
    name: 'orders',
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
    }
});

export default orderSlice.reducer;