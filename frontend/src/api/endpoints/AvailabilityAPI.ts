import { baseApi } from "../BaseAPI.ts";

export type Availability = {
    _id: string;
    startTime: number;
    endTime: number;
    dayOfWeek: number;
    allowedAppointments: string[];
    capacity: number;
    staff: string;
};

export type CreateAvailabilityRequest = Omit<Availability, "_id">;
export type UpdateAvailabilityRequest = Partial<Omit<Availability, "reference">> & {
    reference: string;
};

export const availabilitiesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /availabilities
        getAvailabilities: builder.query<Availability[], void>({
            query: () => ({ url: "/availabilities", method: "GET" }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.map((c) => ({ type: "Availability" as const, _id: c["_id"] })),
                          { type: "Availability" as const, _id: "LIST" },
                      ]
                    : [{ type: "Availability" as const, id: "LIST" }],
        }),

        // GET /availabilities/times
        getTimes: builder.query<Availability[], string | undefined>({
            query: (availabilityType) => ({
                url: `/availabilities/times?availabilityType=${availabilityType}`,
                method: "GET",
            }),
            providesTags: (result, error, _id) => [{ type: "Availability" as const, _id }],
        }),

        // POST /availabilities
        createAvailability: builder.mutation<Availability, CreateAvailabilityRequest>({
            query: (body) => ({ url: "/availabilities", method: "POST", body }),
            invalidatesTags: [{ type: "Availability" as const, id: "LIST" }],
        }),

        // PUT /availabilities/:ref
        updateAvailability: builder.mutation<Availability, UpdateAvailabilityRequest>({
            query: ({ reference, ...body }) => ({
                url: `/availabilities/${reference}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Availability" as const, id: arg["_id"] },
                { type: "Availability" as const, id: "LIST" },
            ],
        }),

        // DELETE /availabilities/:ref
        deleteAvailability: builder.mutation<{ success: boolean } | void, string>({
            query: (ref) => ({ url: `/availabilities/${ref}`, method: "DELETE" }),
            invalidatesTags: (result, error, _id) => [
                { type: "Availability" as const, _id },
                { type: "Availability" as const, id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAvailabilitiesQuery,
    useGetTimesQuery,
    useCreateAvailabilityMutation,
    useUpdateAvailabilityMutation,
    useDeleteAvailabilityMutation,
} = availabilitiesApi;
