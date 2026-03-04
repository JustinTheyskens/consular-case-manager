import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type LoginType = "citizen" | "staff";

export type SessionState = {
    userId: string | null;
    loginType: LoginType | null;
    emailAddress: string | null;
    name?: string | null;
};

const initialState: SessionState = {
    userId: null,
    loginType: null,
    emailAddress: null,
};

const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        setSession(
            state,
            action: PayloadAction<{
                userId: string;
                loginType: LoginType;
                emailAddress: string;
                name?: string;
            }>,
        ) {
            state.userId = action.payload.userId;
            state.loginType = action.payload.loginType;
            state.emailAddress = action.payload.emailAddress;
            state.name = action.payload.name ?? null;
        },
        clearSession(state) {
            state.userId = null;
            state.loginType = null;
            state.emailAddress = null;
            state.name = null;
        },
    },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
