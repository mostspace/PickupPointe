import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";
import {isValidCache} from "../../utils/cache.js";

const base_url = `${BASE_URL}/api/v1/vendor`;

export const getAllLocations = createAsyncThunk("vendor/getLocations", async (pagination) => {
  const {data} = await axiosInstance.get(`${base_url}/locations`);
  return data;
});

export const getLocationById = createAsyncThunk("vendor/getLocationById", async (locationId) => {
  const {data} = await axiosInstance.get(`${base_url}/location/${locationId}`);
  return data;
});

const locationSlice = createSlice({
  name: "vendorLocations",
  initialState: {
    isLoading: false,
    locations: {
      result: [],
      totalCount: 0,
    },
    location: {}
  },
  extraReducers: builder => {
    builder
      .addCase(getAllLocations.pending, state => {state.isLoading = true})
      .addCase(getAllLocations.rejected, state => {state.isLoading = false})
      .addCase(getAllLocations.fulfilled, (state, { payload }) => {
        console.log(payload)
        state.isLoading = false;
        state.locations = {...payload};
      })

      .addCase(getLocationById.pending, (state) => {state.isLoading = true})
      .addCase(getLocationById.rejected, (state) => {state.isLoading = false})
      .addCase(getLocationById.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.location = payload;
      })
  }
});

export default locationSlice.reducer;