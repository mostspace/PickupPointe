import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const itemAdapter = createEntityAdapter({
  selectId: item => item._id,
});

export const getAllItems = createAsyncThunk("getAllItems", async ({
  categories = [],
  searchKey = '',
  pageSize = 10,
  page = 1,
} = {}) => {
  const { data } = await axiosInstance.post(`${BASE_URL}/api/v1/item/all`, { categories }, {
    params: {
      searchKey,
      pageSize,
      page
    }
  });
  return data;
})

export const getItem = createAsyncThunk("getItem", async (id) => {
  const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/item/${id}`);
  return data;
})

export const addItem = createAsyncThunk("items/addItem", async (data) => {
  const { data: result } = await axiosInstance.post(`${BASE_URL}/api/v1/item`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result;
});

export const updateItem = createAsyncThunk("items/updateItem", async ({ id, data }) => {
  console.log("id------in redux", id, data)
  const { data: result } = await axiosInstance.put(`${BASE_URL}/api/v1/item/${id}`, data);
  return result;
});

export const removeItem = createAsyncThunk("items/removeItem", async (id) => {
  const { data } = await axiosInstance.delete(`${BASE_URL}/api/v1/item/${id}`);
  return data;
});

const itemSlice = createSlice({
  name: "items",
  initialState: itemAdapter.getInitialState({
    status: "idle",
    totalResults: 0,
  }),
  extraReducers: builder => {
    builder
      .addCase(getAllItems.pending, state => {
        state.status = "pending";
      })
      .addCase(getAllItems.fulfilled, (state, action) => {
        const { items, totalResults } = action.payload;
        state.status = "fulfilled";
        state.totalResults = totalResults;
        itemAdapter.setAll(state, items);
      })
      .addCase(getAllItems.rejected, state => {
        state.status = "rejected";
      })
      // addItem
      .addCase(addItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const newItem = action.payload;
        itemAdapter.addOne(state, newItem);  // Add the new item to the state
      })
      .addCase(addItem.rejected, (state) => {
        state.status = "rejected";
      })
      // updateItem
      .addCase(updateItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // const updatedItem = action.payload;
        // itemAdapter.updateOne(state, {
        //   id: updatedItem._id,
        //   changes: updatedItem,
        // });
      })
      .addCase(updateItem.rejected, (state) => {
        state.status = "rejected";
      })
      // removeItem
      .addCase(removeItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.status = "fulfilled";
        // itemAdapter.removeOne(state, action.payload);  // Remove the item by ID
      })
      .addCase(removeItem.rejected, (state) => {
        state.status = "rejected";
      })
      // Item
      .addCase(getItem.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getItem.fulfilled, (state, action) => {
        state.status === "fulfilled";
        itemAdapter.setOne(state, action.payload.item);
      })
      .addCase(getItem.rejected, (state) => {
        state.status === "rejected";
      })
  }
})

export const {
  selectAll: selectAllItems,
  selectById: selectItem,
} = itemAdapter.getSelectors(state => state.items);

export const selectItemsInfo = state => state.items;

export default itemSlice.reducer;