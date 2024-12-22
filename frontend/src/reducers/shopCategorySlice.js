import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const shopCategoryAdapter = createEntityAdapter();

export const getAllShopCategories = createAsyncThunk("shopCategories/getAllShopCategories", async () => {
    const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/shop/shop-category`);
    return data;
})

export const addShopCategory = createAsyncThunk("shopCategories/addShopCategory", async (data) => {
    const { data: result } = await axiosInstance.get(`${BASE_URL}/api/v1/shop/shop-category`, data);
    return result;
})

export const removeShopCategory = createAsyncThunk("shopCategories/removeShopCategory", async (id) => {
    const { data } = await axiosInstance.delete(`${BASE_URL}/api/v1/shop/shop-category/${id}`);
    return data;
})

export const updateShopCategory = createAsyncThunk("shopCategories/updateShopCategory", async ({id, data}) => {
    const { data: result } = await axiosInstance.put(`${BASE_URL}/api/v1/shop/shop-category/${id}`, data);
    return result;
})


const shopCategorySlice = createSlice({
    name: "shopCategories",
    initialState: shopCategoryAdapter.getInitialState({
        status: 'idle'
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllShopCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = "pending";
            })
            .addCase(getAllShopCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.status = "fulfilled";
            })
            .addCase(getAllShopCategories.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(addShopCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = "pending";
            })
            .addCase(addShopCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.status = "fulfilled";
            })
            .addCase(addShopCategory.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(removeShopCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = "pending";
            })
            .addCase(removeShopCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.status = "fulfilled";
            })
            .addCase(removeShopCategory.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(updateShopCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = "pending";
            })
            .addCase(updateShopCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.status = "fulfilled";
            })
            .addCase(updateShopCategory.rejected, (state) => {
                state.status = "rejected";
            })
    }
})

export default shopCategorySlice.reducer;