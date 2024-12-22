import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axiosInstance from "src/utils/axios";
import { BASE_URL } from "src/config-global";

// Initial state for the user slice
const initialState = {
  userInfo: {},
  token: null, // Store the auth token
  status: "idle",
  searchedUsers: []
};

export const getCurrentUser = createAsyncThunk("getCurrentUser", async () => {
  const response = await axiosInstance.get(
    `${BASE_URL}/api/v1/user/get-current-user`
  );
  return response.data.user
})

export const searchUsers = createAsyncThunk("searchUsers", async ({filterString, userType, userId}) => {
  console.log("BASE_URL", BASE_URL, userType, filterString)
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/api/v1/user/get-user-list`, {
        params: { search: filterString, userRole: userType, userId: userId }
      }
    );
    console.log("searchuser", response.data)

    return response.data
  } catch (error) {
    console.log("searchuser error", error)
  }
})

// User slice definition
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set user information
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    // Action to set the auth token
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload)
    },
    // Action to reset user state
    resetUser: (state) => {
      state.userInfo = initialState.userInfo;
      state.token = initialState.token;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCurrentUser.pending, state => {
        state.status = "pending";
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        const currentUser = action.payload;
        state.status = "fulfilled";
        state.userInfo = currentUser;
      })
      .addCase(getCurrentUser.rejected, state => {
        state.status = "rejected";
      })

      .addCase(searchUsers.pending, state => {
        state.status = "pending";
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.searchedUsers = action.payload;
      })
      .addCase(searchUsers.rejected, state => {
        state.status = "rejected";
      })
  }
});

// Export actions
export const { setUserInfo, setToken, resetUser } = userSlice.actions;


// Selector to get token
export const selectToken = (state) => state.userInfo.token;

// Export reducer
export default userSlice.reducer;
