import { baseApi } from "../BaseAPI.ts";
import type { Appointment } from "./Appointments.ts";

export type Case = {
    _id: string;
    reference: number;
    status: string;
    appointment: Appointment;
    assignedStaff: string;
    citizen: string;
    checkedIn: boolean;
    flagged: boolean;
    notes?: string;
};

export type CreateCaseRequest = Omit<Case, "_id">;
export type UpdateCaseRequest = Partial<Omit<Case, "reference">> & { reference: string };

export const casesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /cases
        getCases: builder.query<Case[], void>({
            query: () => ({ url: "/cases", method: "GET" }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((c) => ({ type: "Case" as const, _id: c["_id"] })),
                          { type: "Case" as const, _id: "LIST" },
                      ]
                    : [{ type: "Case" as const, id: "LIST" }],
        }),

        // GET /cases/:ref
        getCaseByRef: builder.query<Case, string>({
            query: (ref) => ({ url: `/cases/${ref}`, method: "GET" }),
            providesTags: (result, error, _id) => [{ type: "Case" as const, _id }],
        }),

        // POST /cases
        createCase: builder.mutation<Case, CreateCaseRequest>({
            query: (body) => ({ url: "/cases", method: "POST", body }),
            invalidatesTags: [{ type: "Case" as const, id: "LIST" }],
        }),

        // PUT /cases/:ref
        updateCase: builder.mutation<Case, UpdateCaseRequest>({
            query: ({ reference, ...body }) => ({
                url: `/cases/${reference}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Case" as const, id: arg["_id"] },
                { type: "Case" as const, id: "LIST" },
            ],
        }),

        // DELETE /cases/:ref
        deleteCase: builder.mutation<{ success: boolean } | void, string>({
            query: (ref) => ({ url: `/cases/${ref}`, method: "DELETE" }),
            invalidatesTags: (result, error, _id) => [
                { type: "Case" as const, _id },
                { type: "Case" as const, id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCasesQuery,
    useGetCaseByRefQuery,
    useCreateCaseMutation,
    useUpdateCaseMutation,
    useDeleteCaseMutation,
} = casesApi;
