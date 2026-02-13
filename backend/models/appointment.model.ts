import mongoose, { Schema } from "mongoose";

export const appointmentTypes = [
    "passport-renewal",
    "passport-first",
    "passport-emergency",
    "passport-lost",
] as const;

export interface IAppointment {
    type: (typeof appointmentTypes)[number];
    time: string;
}

const appointmentSchema = new Schema<IAppointment>({
    type: {
        required: true,
        type: String,
        enum: appointmentTypes,
    },

    time: {
        required: true,
        type: String,
    },
});

export const Appointment = mongoose.model<IAppointment>(
    "Appointment",
    appointmentSchema,
    "appointments",
);
