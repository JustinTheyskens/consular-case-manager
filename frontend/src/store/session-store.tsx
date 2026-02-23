import { createSlice, type PayloadAction, configureStore } from "@reduxjs/toolkit";

export type LoginType = "citizen" | "staff";

type SessionState = {
    userId: string | null;
    loginType: LoginType | null;
};

const initialState: SessionState = {
    userId: null,
    loginType: null,
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSession(state, action: PayloadAction<{ userId: string; loginType: LoginType }>) {
            state.userId = action.payload.userId;
            state.loginType = action.payload.loginType;
        },
        clearSession(state) {
            state.userId = null;
            state.loginType = null;
        },
    },
});

export const sessionStore = configureStore({
    reducer: {
        session: sessionSlice.reducer,
    },
});

export const { setSession, clearSession } = sessionSlice.actions;
export type RootState = ReturnType<typeof sessionStore.getState>;
