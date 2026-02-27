import { baseApi } from "../BaseAPI.ts";

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    userId: string;
};

export const loginAPI = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /login
        // Accepts LoginRequest
        // Returns LoginResponse
        sendLogin: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({ url: "/login", method: "POST", body }),
        }),
    }),
    overrideExisting: false,
});

export const { useSendLoginMutation } = loginAPI;
