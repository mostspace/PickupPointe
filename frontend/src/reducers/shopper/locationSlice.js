import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";
import {isValidCache} from "../../utils/cache.js";

const base_url = `${BASE_URL}/api/v1/shopper`;

export const getAllLocations = createAsyncThunk("shopper/getLocations", async (thunkAPI) => {
/*  const state = thunkAPI.getState();
  const currentLocations = state.shopperLocations.locations;
  console.log(currentLocations);
  if (isValidCache(currentLocations.timestamp)) {
    return currentLocations
  }*/

  const {data} = await axiosInstance.get(`${base_url}/locations`);
  console.log(data);
  return data;
});

export const getLocationById = createAsyncThunk("shopper/getLocationById", async (locationId, thunkAPI) => {
  const state = thunkAPI.getState();
  const currentLocation = state.shopperLocations.location;
  if (currentLocation && currentLocation._id === locationId) {
    return currentLocation;
  }

  const {data} = await axiosInstance
    .get(`${base_url}/location/${locationId}`);
  return data;
});

const locationSlice = createSlice({
  name: "shopperLocations",
  initialState: {
    isLoading: false,
    locations: {
      result: [],
      totalCount: 0,
      timestamp: 0
    },
    location: {}
  },
  extraReducers: builder => {
    builder
      .addCase(getAllLocations.pending, state => state.isLoading = true)
      .addCase(getAllLocations.rejected, state => state.isLoading = false)
      .addCase(getAllLocations.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.locations = {payload, timestamp: Date.now()};
      })

      .addCase(getLocationById.pending, (state) => state.isLoading = true)
      .addCase(getLocationById.rejected, (state) => state.isLoading = false)
      .addCase(getLocationById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.location = payload;
      })
  }
});

export default locationSlice.reducer;