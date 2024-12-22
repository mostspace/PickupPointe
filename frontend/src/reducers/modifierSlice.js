import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addModifier, updateModifier, removeModifier, getModifiers } from 'src/api/vendor/modifier';
import axiosInstance from "../utils/axios.js";
import {BASE_URL} from "../config-global.js";

// Async Thunks
export const fetchModifiers = createAsyncThunk(
  'modifiers/fetchModifiers',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getModifiers();
      return data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch modifiers');
    }
  }
);

export const createModifier = createAsyncThunk(
  'modifiers/createModifier',
  async (params, { rejectWithValue }) => {
    try {
      const data = await addModifier(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to create modifier');
    }
  }
);

export const editModifier = createAsyncThunk(
  'modifiers/editModifier',
  async ({ params, id }, { rejectWithValue }) => {
    try {
      const data = await updateModifier(params, id);
      return { id, ...(data || params) };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to update modifier');
    }
  }
);

export const deleteModifier = createAsyncThunk(
  'modifiers/deleteModifier',
  async (id, { rejectWithValue }) => {
    try {
      await removeModifier(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to delete modifier');
    }
  }
);

export const updateModifierInStock = createAsyncThunk('modifiers/updateModifierInStock', async ({ id, isInStock }) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/api/v1/modifier/set-in-stock`, { id, isInStock });
  } catch (err) {
  
  }
});

// Initial State
const initialState = {
  modifiers: [],
  isLoading: {
    fetch: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
};

const modifierSlice = createSlice({
  name: 'modifiers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Modifiers
      .addCase(fetchModifiers.pending, (state) => {
        state.isLoading.fetch = true;
        state.error = null;
      })
      .addCase(fetchModifiers.fulfilled, (state, action) => {
        console.log('Fetched modifiers:', action.payload); // Check the fetched data here
        state.isLoading.fetch = false;
        state.modifiers = action.payload || [];
      })
      .addCase(fetchModifiers.rejected, (state, action) => {
        state.isLoading.fetch = false;
        state.error = action.payload;
      })

      // Create Modifier
      .addCase(createModifier.pending, (state) => {
        state.isLoading.create = true;
        state.error = null;
      })
      .addCase(createModifier.fulfilled, (state, action) => {
        state.isLoading.create = false;
        state.modifiers.push(action.payload);
      })
      .addCase(createModifier.rejected, (state, action) => {
        state.isLoading.create = false;
        state.error = action.payload;
      })

      // Update Modifier
      .addCase(editModifier.pending, (state) => {
        state.isLoading.update = true;
        state.error = null;
      })
      .addCase(editModifier.fulfilled, (state, action) => {
        state.isLoading.update = false;
        const index = state.modifiers.findIndex((modifier) => modifier.id === action.payload.id);
        if (index !== -1) {
          state.modifiers[index] = action.payload;
        }
      })
      .addCase(editModifier.rejected, (state, action) => {
        state.isLoading.update = false;
        state.error = action.payload;
      })

      // Delete Modifier
      .addCase(deleteModifier.pending, (state) => {
        state.isLoading.delete = true;
        state.error = null;
      })
      .addCase(deleteModifier.fulfilled, (state, action) => {
        state.isLoading.delete = false;
        state.modifiers = state.modifiers.filter((modifier) => modifier.id !== action.payload);
      })
      .addCase(deleteModifier.rejected, (state, action) => {
        state.isLoading.delete = false;
        state.error = action.payload;
      })
  },
});

export default modifierSlice.reducer;
