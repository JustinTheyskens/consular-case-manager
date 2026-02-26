import { baseApi } from "../BaseAPI.ts";

export type Citizen = {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type CreateCitizenRequest = Omit<Citizen, "_id">;
export type UpdateCitizenRequest = Partial<Omit<Citizen, "_id">> & { _id: string };

export const citizensApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /citizens
        getCitizens: builder.query<Citizen[], void>({
            query: () => ({ url: "/citizens", method: "GET" }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((c) => ({ type: "Citizen" as const, _id: c["_id"] })),
                          { type: "Citizen" as const, _id: "LIST" },
                      ]
                    : [{ type: "Citizen" as const, id: "LIST" }],
        }),

        // GET /citizens/:id
        getCitizenById: builder.query<Citizen, string>({
            query: (id) => ({ url: `/citizens/${id}`, method: "GET" }),
            providesTags: (result, error, _id) => [{ type: "Citizen" as const, _id }],
        }),

        // POST /citizens
        createCitizen: builder.mutation<Citizen, CreateCitizenRequest>({
            query: (body) => ({ url: "/citizens", method: "POST", body }),
            invalidatesTags: [{ type: "Citizen" as const, id: "LIST" }],
        }),

        // PUT /citizens/:id
        updateCitizen: builder.mutation<Citizen, UpdateCitizenRequest>({
            query: ({ _id, ...body }) => ({ url: `/citizens/${_id}`, method: "PUT", body }),
            invalidatesTags: (result, error, arg) => [
                { type: "Citizen" as const, id: arg["_id"] },
                { type: "Citizen" as const, id: "LIST" },
            ],
        }),

        // DELETE /citizens/:id
        // Unsure if we'll end up using this one,
        // but making it available since it's available in the back-end
        deleteCitizen: builder.mutation<{ success: boolean } | void, string>({
            query: (id) => ({ url: `/citizens/${id}`, method: "DELETE" }),
            invalidatesTags: (result, error, _id) => [
                { type: "Citizen" as const, _id },
                { type: "Citizen" as const, id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCitizensQuery,
    useGetCitizenByIdQuery,
    useCreateCitizenMutation,
    useUpdateCitizenMutation,
    useDeleteCitizenMutation,
} = citizensApi;
