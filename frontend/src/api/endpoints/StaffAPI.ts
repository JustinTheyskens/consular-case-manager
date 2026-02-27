import { baseApi } from "../BaseAPI.ts";

export type Staff = {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
};

export type CreateStaffRequest = Omit<Staff, "_id">;
export type UpdateStaffRequest = Partial<Omit<Staff, "_id">> & { _id: string };

export const staffAPI = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /staff
        getStaff: builder.query<Staff[], void>({
            query: () => ({ url: "/staff", method: "GET" }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((c) => ({ type: "Staff" as const, _id: c["_id"] })),
                          { type: "Staff" as const, _id: "LIST" },
                      ]
                    : [{ type: "Staff" as const, id: "LIST" }],
        }),

        // GET /staff/:id
        getStaffById: builder.query<Staff, string>({
            query: (id) => ({ url: `/staff/${id}`, method: "GET" }),
            providesTags: (result, error, _id) => [{ type: "Staff" as const, _id }],
        }),

        // POST /staff
        createStaff: builder.mutation<Staff, CreateStaffRequest>({
            query: (body) => ({ url: "/staff", method: "POST", body }),
            invalidatesTags: [{ type: "Staff" as const, id: "LIST" }],
        }),

        // PUT /staff/:id
        updateStaff: builder.mutation<Staff, UpdateStaffRequest>({
            query: ({ _id, ...body }) => ({ url: `/staff/${_id}`, method: "PUT", body }),
            invalidatesTags: (result, error, arg) => [
                { type: "Staff" as const, id: arg["_id"] },
                { type: "Staff" as const, id: "LIST" },
            ],
        }),

        // DELETE /staff/:id
        // Unsure if we'll end up using this one,
        // but making it available since it's available in the back-end
        deleteStaff: builder.mutation<{ success: boolean } | void, string>({
            query: (id) => ({ url: `/staff/${id}`, method: "DELETE" }),
            invalidatesTags: (result, error, _id) => [
                { type: "Staff" as const, _id },
                { type: "Staff" as const, id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetStaffQuery,
    useGetStaffByIdQuery,
    useCreateStaffMutation,
    useUpdateStaffMutation,
    useDeleteStaffMutation,
} = staffAPI;
