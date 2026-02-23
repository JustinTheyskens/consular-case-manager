import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./SessionSlice.ts";
import { baseApi } from "../api/BaseAPI.ts";

export const store = configureStore({
    reducer: {
        session: sessionReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
