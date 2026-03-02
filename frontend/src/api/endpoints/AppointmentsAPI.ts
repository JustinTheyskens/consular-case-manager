import { baseApi } from "../BaseAPI.ts";

export type Appointment = {
    _id: string;
    type: string;
    time: Date;
};

export type UpdateAppointmentRequest = Partial<Omit<Appointment, "_id">> & { _id: string };

export const casesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // PUT /appointments/:id
        updateAppointment: builder.mutation<UpdateAppointmentRequest, Appointment>({
            query: ({ _id, ...body }) => ({ url: `/cases/${_id}`, method: "PUT", body }),
            invalidatesTags: (result, error, arg) => [
                { type: "Appointment" as const, id: arg["_id"] },
                { type: "Appointment" as const, id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const { useUpdateAppointmentMutation } = casesApi;
