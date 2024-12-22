import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BASE_URL } from "src/config-global";
import axiosInstance from "src/utils/axios";

// Async Thunks
export const fetchReviewsByShop = createAsyncThunk(
  'reviews/fetchReviewsByShop',
  async ({ shopId, page, pageSize, sortKey }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/v1/review/${shopId}`, {
        params: { page, 'page-size': pageSize, 'sort-key': sortKey },
      });

      console.log("response data: ", response);
      return response.data; // Expecting { totalResults, reviews }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postReview = createAsyncThunk(
  'reviews/postReview',
  async ({ shopId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/v1/review/${shopId}`, reviewData);
      return response.data.review; // Expecting { review }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    totalResults: 0,
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {}, // Optional for synchronous actions
  extraReducers: (builder) => {
    // Fetch reviews
    builder
      .addCase(fetchReviewsByShop.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsByShop.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload.reviews;
        state.totalResults = action.payload.totalResults;
      })
      .addCase(fetchReviewsByShop.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Post a review
    builder
      .addCase(postReview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews.unshift(action.payload); // Add new review to the top
        state.totalResults += 1;
      })
      .addCase(postReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;