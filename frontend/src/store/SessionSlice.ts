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

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
