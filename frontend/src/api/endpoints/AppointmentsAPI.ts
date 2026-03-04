import { baseApi } from "../BaseAPI";
import type { Appointment } from "./Appointments";

export const appointmentsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // do we need this, or are our apt types static?
        getAppointmentTypes: builder.query<Appointment[], void>({
            query: () => "/appointments/types", // verify this
            providesTags: ["UpcomingAppointment"],
        }),

        getUpcomingAppointment: builder.query({
            query: (userId: string) => `/appointments/upcoming/${userId}`,
            providesTags: ["UpcomingAppointment"],
        }),

        bookAppointment: builder.mutation({
            query: (payload) => ({
                url: "/appointments",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["UpcomingAppointment"],
        }),

        modifyAppointment: builder.mutation({
            query: ({ id, changes }) => ({
                url: `/appointments/${id}`,
                method: "PATCH",
                body: changes,
            }),
            invalidatesTags: ["UpcomingAppointment"],
        }),

        cancelAppointment: builder.mutation({
            query: (id) => ({
                url: `/appointments/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["UpcomingAppointment"],
        }),
    }),
});

export const {
    useGetAppointmentTypesQuery,
    useGetUpcomingAppointmentQuery,
    useBookAppointmentMutation,
    useModifyAppointmentMutation,
    useCancelAppointmentMutation,
} = appointmentsApi;
