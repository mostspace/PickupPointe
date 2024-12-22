import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the role
const initialState = {
  selectedRole: '', // Initial role value (can be '' or 'restaurant' or 'vendor')
};

// Create the slice
const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action) => {
      // Update the selectedRole state with the value provided in the action payload
      state.selectedRole = action.payload;
    },
  },
});

// Export actions generated from the slice
export const { setRole } = roleSlice.actions;

// Export the reducer to be used in the store
export default roleSlice.reducer;
