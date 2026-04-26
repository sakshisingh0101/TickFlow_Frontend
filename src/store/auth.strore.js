import { createSlice } from '@reduxjs/toolkit'
const savedUser = JSON.parse(localStorage.getItem("userData"))
const normalizedSavedUser = savedUser
  ? {
      ...savedUser,
      role: savedUser.role || savedUser.userType || savedUser.usertype,
    }
  : null;

const initialState = {
    isLoggedIn: !!normalizedSavedUser,
    user: normalizedSavedUser,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        }
    }
})
export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;