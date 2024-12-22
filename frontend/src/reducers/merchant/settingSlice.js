import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const initialState = {
  isLoading: false,
  settings: {}
};

export const getSettings = createAsyncThunk('redux/merchant/getSettings', async () => {
  try {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/merchant/settings`);
    return data;
  } catch (error) {
    toast(`Error on fetching settings`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});

export const setSettings = createAsyncThunk('redux/merchant/setSettings', async (params) => {
  try {
    const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/merchant/settings`, params);
    return data;
  } catch (error) {
    toast(`Error on saving settings`, {
      type: 'error',
      className: 'toast-custom',
    });
    throw error;
  }
});



const settingSlice = createSlice({
  name: 'merchantSetting',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSettings.fulfilled, (state, { payload }) => {
        state.settings = payload;
        state.isLoading = false;
      })
      .addCase(getSettings.rejected, (state) => {
        state.isLoading = false;
      })
      
      .addCase(setSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setSettings.fulfilled, (state, { payload }) => {
        state.settings = payload;
        state.isLoading = false;
      })
      .addCase(setSettings.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

export default settingSlice.reducer;