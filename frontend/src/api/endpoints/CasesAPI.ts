import { baseApi } from "../BaseAPI.ts";
import type { Appointment } from "./AppointmentsAPI.ts";
import type { Citizen } from "./CitizensAPI.ts";
import type { Staff } from "./StaffAPI.ts";

export type Case = {
    _id: string;
    reference: number;
    status: string;
    appointment: Appointment;
    assignedStaff: Staff;
    citizen: Citizen;
    checkedIn: boolean;
    flagged: boolean;
    notes?: string;
};

export type CreateCaseRequest = {
    appointment: Appointment;
    citizen: string;
};
export type UpdateCaseRequest = Partial<Omit<Case, "reference">> & { reference: number };

export const casesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /cases
        getCases: builder.query<Case[], { staff?: string; citizen?: string } | void>({
            query: (params) => ({ url: "/cases", method: "GET", params: params ?? undefined }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((c) => ({ type: "Case" as const, id: c["_id"] })),
                          { type: "Case" as const, id: "LIST" },
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
        updateCase: builder.mutation<Case, Case>({
            query: (body) => ({
                url: `/cases/${body.reference}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Case" as const, id: arg["_id"] },
                { type: "Case" as const, id: "LIST" },
            ],
        }),

        // GET /cases?citizen=:citizenId
        getCasesByCitizen: builder.query<Case[], string>({
            query: (citizenId) => ({ url: `/cases?citizen=${citizenId}`, method: "GET" }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((c) => ({ type: "Case" as const, id: c._id })),
                          { type: "Case" as const, id: "LIST" },
                      ]
                    : [{ type: "Case" as const, id: "LIST" }],
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
    useGetCasesByCitizenQuery,
    useCreateCaseMutation,
    useUpdateCaseMutation,
    useDeleteCaseMutation,
} = casesApi;
