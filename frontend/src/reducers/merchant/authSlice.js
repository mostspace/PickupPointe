import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  token: "",
  merchant: {},
  shopInfo: {},
  loading: false,
};

export const merchantLogin = createAsyncThunk('merchant/auth/login', async (formData) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/auth/login`, formData);
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    toast(error.message, {type: 'error', className: 'toast-custom'});
    throw error;
  }
})

const authSlice = createSlice({
  name: 'merchantAuth',
  initialState,
  reducers: {
    setToken: (state, payload) => {
      state.token = payload;
      localStorage.setItem("token", payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(merchantLogin.pending, (state) => {
        state.loading = true;
      },)
      .addCase(merchantLogin.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.merchant = payload.merchant;
        state.loading = false;
      })
      .addCase(merchantLogin.rejected, (state) => {
        state.loading = false;
      })
  }
});

export const { setToken } = authSlice.actions;

export const authReducer = authSlice.reducer;