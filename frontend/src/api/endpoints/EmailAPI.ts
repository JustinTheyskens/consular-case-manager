import { baseApi } from "../BaseAPI.ts";

export type EmailRequest = {
    from?: string;
    to: string;
    subject: string;
    //Ideally we should use both, a minimum of one is technically required.
    text?: string;
    html?: string;
};

export const emailAPI = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /email/send
        // Accepts EmailRequest
        // Returns nothing, just a 200 if it worked
        sendEmail: builder.mutation<void, EmailRequest>({
            query: (body) => ({ url: "/email/send", method: "POST", body }),
        }),
    }),
    overrideExisting: false,
});

export const { useSendEmailMutation } = emailAPI;
