import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  orderList: {
    result: [],
    totalCount: 0,
    page: 0
  },
  isLoading: false
};

export const getSearchOrders = createAsyncThunk('shopper/getSearchOrders', async (query) => {
  try {
    if (query === "") {
      return {result: [], totalCount: 0, page: 0}
    }
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/shopper/search_order?query=${query}`);
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

const searchSlice = createSlice({
  name: 'shopperSearch',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSearchOrders.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(getSearchOrders.fulfilled, (state, { payload }) => {
        state.orderList = payload;
        state.isLoading = false;
      })
      .addCase(getSearchOrders.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export default searchSlice.reducer;