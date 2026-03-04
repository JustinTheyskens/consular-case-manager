import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LoginType = "citizen" | "staff";

export type SessionState = {
    userId: string | null;
    loginType: LoginType | null;
    name?: string | null;
};

const initialState: SessionState = {
    userId: null,
    loginType: null,
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSession(state, action: PayloadAction<{ userId: string; loginType: LoginType; name?: string}>) {
            state.userId = action.payload.userId;
            state.loginType = action.payload.loginType;
            state.name = action.payload.name ?? null;
        },
        clearSession(state) {
            state.userId = null;
            state.loginType = null;
            state.name = null;
        },
    },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
