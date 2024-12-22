// src/redux/slices/shopSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getShops, addShop, updateShop, deleteShop } from 'src/api/vendor/shops';

// Fetch shops
export const fetchShops = createAsyncThunk('shops/fetchShops', async () => {
  const response = await getShops();
  return response.shops;
});

// Add a new shop
export const addNewShop = createAsyncThunk('shops/addShop', async (payload) => {
  const response = await addShop(payload);
  return response;  // Assumes response contains the added shop data
});

// Update an existing shop
export const updateExistingShop = createAsyncThunk('shops/updateShop', async ({ id, payload }) => {
  await updateShop(id, payload);
  return { id, payload };
});

// Delete a shop
export const deleteExistingShop = createAsyncThunk('shops/deleteShop', async (id) => {
  await deleteShop(id);
  return id;
});

const shopSlice = createSlice({
  name: 'shops',
  initialState: {
    shops: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Add shop
      .addCase(addNewShop.fulfilled, (state, action) => {
        state.shops.push(action.payload);
      })
      .addCase(addNewShop.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // Update shop
      .addCase(updateExistingShop.fulfilled, (state, action) => {
        const { id, payload } = action.payload;
        const existingShop = state.shops.find((shop) => shop.shopId === id);
        if (existingShop) {
          Object.assign(existingShop, payload);
        }
      })
      .addCase(updateExistingShop.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // Delete shop
      .addCase(deleteExistingShop.fulfilled, (state, action) => {
        state.shops = state.shops.filter((shop) => shop.shopId !== action.payload);
      })
      .addCase(deleteExistingShop.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default shopSlice.reducer;