import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

export const getAllUsers = createAsyncThunk("getAllUsers", async (params = { pageSize: 10, page: 1, searchKey: '', locations: [] }) => {
  const payload = {
    locations: params.locations
  }
  const newParams = {
    ...params
  }
  delete newParams.locations
  const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/vendor/tablet-user/all`, payload, { params: newParams });
  return data;
});

export const addUser = createAsyncThunk("addUser", async (payload = {
  firstName: "",
  lastName: "",
  password: "",
  contactNumber: "",
  contactEmail: "",
  locations: []
}) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/vendor/tablet-user`, payload);
  return data;
});

export const editUser = createAsyncThunk("editUser", async (userId, payload = {
  firstName: "",
  lastName: "",
  password: "",
  contactNumber: "",
  contactEmail: "",
  locations: [],
  status: ""
}) => {
  const res = await axiosInstance.patch(`${BASE_URL}/api/v1/vendor/tablet-user/${userId}`, payload);
  return res.data;
});

const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    users: {
      status: "idle",
      totalResults: 0,
      data: [],
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllUsers.pending, state => {
        state.users.status = "pending";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const { locations, totalResults } = action.payload;
        state.users.status = "fulfilled";
        state.users.totalResults = totalResults;
        state.users.data = locations;
      })
      .addCase(getAllUsers.rejected, state => {
        state.users.status = "rejected";
      })
  }
})

export default vendorSlice.reducer;