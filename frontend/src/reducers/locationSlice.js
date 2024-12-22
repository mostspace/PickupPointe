import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

export const getAllLocations = createAsyncThunk("getAllLocations", async () => {
  const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/location`, {
    params: {
      pageSize: 1000
    }
  });

  return data;
});

export const getLocationByShop = createAsyncThunk("getLocationByShop", async (shopId) => {
  if (!shopId) return [];
  const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/location`, {
    params: {
      pageSize: 1000,
      shop: shopId
    }
  });

  return data;
})

const locationSlice = createSlice({
  name: "locations",
  initialState: {
    status: "idle",
    totalResults: 0,
    locations: [],
  },
  extraReducers: builder => {
    builder
      .addCase(getAllLocations.pending, state => {
        state.status = "pending";
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        const { locations, totalResults } = action.payload;
        state.status = "fulfilled";
        state.totalResults = totalResults;
        state.locations = locations;
      })
      .addCase(getAllLocations.rejected, state => {
        state.status = "rejected";
      })
      .addCase(getLocationByShop.fulfilled, (state, action) => {
        state.locations = action.payload.locations || [];
      });
  }
})

export default locationSlice.reducer;