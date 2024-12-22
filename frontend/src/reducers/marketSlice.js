import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "src/utils/axios";
import { BASE_URL } from "src/config-global";

const initialState = {
    status: 'idle',
    shopList: [],
    shop: {},
    locationId: ""
}

export const getShopProfile = createAsyncThunk("getShopProfile", async ({shopId, longitude, latitude}) => {
    const response = await axiosInstance.get(`${BASE_URL}/api/v1/shop/${shopId}/marketplace?longitude=${longitude}&latitude=${latitude}`)
    return response.data.shop;
})

export const getShopListProfile = createAsyncThunk("getShopListProfile", async ({params}) => {
    const response = await axiosInstance.post(`${BASE_URL}/api/v1/shop/local`, {params: params});
    return response.data;
})

const marketSlice = createSlice({
    name: "market",
    initialState,
    reducers: {
        setSelectedLocationId: (state, action) => {
            state.locationId = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getShopProfile.pending, (state) => {
                state.status = "pending"
            })
            .addCase(getShopProfile.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.shop = action.payload;
            })
            .addCase(getShopProfile.rejected, (state) => {
                state.status = "rejected"
            })

            .addCase(getShopListProfile.pending, (state) => {
                state.status = "pending"
            })
            .addCase(getShopListProfile.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.shopList = action.payload;
            })
            .addCase(getShopListProfile.rejected, (state) => {
                state.status = "rejected"
            })
    }
})

export const {setSelectedLocationId} = marketSlice.actions;

export default marketSlice.reducer;