import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    //TODO: ADD TAGS FOR ALL TYPES
  
    tagTypes: ["Citizen", "Staff", "Case", "Appointment", "UpcomingAppointment"],
    endpoints: () => ({}),
});
