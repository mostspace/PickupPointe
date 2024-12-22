import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

export const fetchDashboardData = createAsyncThunk("vendor/getDashboard", async (params) => {
  const {data} = await axiosInstance.get(`${BASE_URL}/api/v1/vendor/dashboard/get_dashboard_info`, {params});
  return data;
});

const dashboardSlice = createSlice({
  name: "vendorDashboard",
  initialState: {
    isLoading: false,
    overviewInfo: {},
    generalProfit: {},
    recentOrders: {},
    incomeInfo: {},
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDashboardData.pending, state => {state.isLoading = true})
      .addCase(fetchDashboardData.rejected, state => {state.isLoading = false})
      .addCase(fetchDashboardData.fulfilled, (state, { payload }) => {
        console.log(payload)
        state.isLoading = false;
        state.overviewInfo = payload?.overviewInfo || state.overviewInfo;
        state.generalProfit = payload?.generalProfit || state.generalProfit;
        state.recentOrders = payload?.recentOrders || state.recentOrders;
        state.incomeInfo = payload?.incomeInfo || state.incomeInfo;
        // state = {...state.dashboard, ...payload};
      })
  }
});

export default dashboardSlice.reducer;