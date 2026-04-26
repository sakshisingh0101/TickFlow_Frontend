import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.strore";
export const authstore = configureStore({
    reducer: {
        auth: authReducer
    }
})