import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  menuList: {
    result: [],
  },
  modifiers: {
    result: [],
  },
  isLoading: false
};


export const getMenus = createAsyncThunk('redux/merchant/getMenus', async () => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/merchant/menu/list`);
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const getModifiers = createAsyncThunk('redux/merchant/getModifiers', async () => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/merchant/menu/modifiers`);
    return data;
  } catch (error) {
    toast(`Error on fetching orders`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

export const setModifierOutOfStock = createAsyncThunk('redux/merchant/setModifierOutOfStock', async (params) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/menu/set-modifier-out-of-stock`, params);
    return data;
  } catch (error) {
    toast(`Error on update.`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
})

const orderSlice = createSlice({
  name: 'merchantOrder',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getMenus.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(getMenus.fulfilled, (state, { payload }) => {
        state.menuList = payload;
        state.isLoading = false;
      })
      .addCase(getMenus.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(getModifiers.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(getModifiers.fulfilled, (state, { payload }) => {
        state.modifiers = payload;
        state.isLoading = false;
      })
      .addCase(getModifiers.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(setModifierOutOfStock.pending, (state) => {
        state.isLoading = true;
      },)
      .addCase(setModifierOutOfStock.fulfilled, (state, { payload }) => {
        state.isLoading = false;
      })
      .addCase(setModifierOutOfStock.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export default orderSlice.reducer;