import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

const categoryAdapter = createEntityAdapter();

export const getAllCategories = createAsyncThunk("categories/getAllCategories", async () => {
  const { data } = await axiosInstance.get(`${BASE_URL}/api/v1/item-category`);
  return data;
});

export const addItemCategory = createAsyncThunk("categories/addItemCategory", async (data) => {
  const { data: categoryData } = await axiosInstance.post(`${BASE_URL}/api/v1/item-category`, data);
  return categoryData;
});

export const removeItemCategory = createAsyncThunk(
  "categories/removeItemCategory",
  async (id) => {
    const { data } = await axiosInstance.delete(`${BASE_URL}/api/v1/item-category/${id}`);
    return data;
  }
);

export const updateItemCategory = createAsyncThunk(
  "categories/updateItemCategory",
  async ({ id, data }) => {
    const { data: result } = await axiosInstance.put(`${BASE_URL}/api/v1/item-category/${id}`, data);
    return result;
  }
);

// Utility function to transform categories
const transformCategories = (itemCategories) => {
  return itemCategories.map((c) => ({
    ...c,
    id: c._id,
    name: c.category,
  }));
};

const categorySlice = createSlice({
  name: "itemCategories",
  initialState: categoryAdapter.getInitialState({
    status: "idle",
  }),
  reducers: {
    setCategories: (state, action) => {
      categoryAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        const { itemCategories } = action.payload;
        state.status = "fulfilled";
        const newCategories = transformCategories(itemCategories);
        categoryAdapter.setAll(state, newCategories);
      })
      .addCase(getAllCategories.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(addItemCategory.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addItemCategory.fulfilled, (state, action) => {
        const { category } = action.payload;
        state.status = "fulfilled";
        const newCategory = {
          ...category,
          id: category._id,
          name: category.category,
        };
        categoryAdapter.addOne(state, newCategory);
      })
      .addCase(addItemCategory.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(removeItemCategory.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeItemCategory.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const { itemCategories } = action.payload;
        const newCategories = transformCategories(itemCategories);
        categoryAdapter.setAll(state, newCategories);
      })
      .addCase(removeItemCategory.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(updateItemCategory.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateItemCategory.fulfilled, (state, action) => {
        state.status = "fulfilled";
        const { itemCategories } = action.payload;
        const newCategories = transformCategories(itemCategories);
        categoryAdapter.setAll(state, newCategories);
      })
      .addCase(updateItemCategory.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export const {
  selectAll: selectAllCategories,
} = categoryAdapter.getSelectors((state) => state.itemCategories);

export const { setCategories } = categorySlice.actions;

export const selectCategoryInfo = (state) => state.itemCategories;

// Selectors in itemCategorySlice.js
export const selectIsLoading = (state) => state.itemCategories.status === "pending";

export default categorySlice.reducer;
