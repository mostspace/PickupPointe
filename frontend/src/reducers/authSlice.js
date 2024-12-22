import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    type: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.type = action.payload.type;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.type = null;
        },
        updateUser: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload
            }
        }
    }
})

export const { setUser, logout, updateUser } = authSlice.actions;
export const authReducer = authSlice.reducer;