import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const metricAdapter = createEntityAdapter();

export const getAllMetrics = createAsyncThunk("metrics/getAllMetrics", async () => {
  const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/item/metrics`);
  return data;
});

const metricSlice = createSlice({
  name: "metrics",
  initialState: metricAdapter.getInitialState({
    status: "idle",
    totalResults: 0,
    metrics: [],
  }),
  extraReducers: (builder) => {
    builder
      .addCase(getAllMetrics.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllMetrics.fulfilled, (state, action) => {
        const { metrics } = action.payload;
        state.status = "fulfilled";
        state.metrics = metrics;
      })
      .addCase(getAllMetrics.rejected, (state) => {
        state.status = "rejected";
      })
  },
});

export const selectMetricInfo = (state) => state.metrics;

export default metricSlice.reducer;
