import mongoose, { Schema } from "mongoose";

const appointmentTypes = [
    "passport-renewal",
    "passport-first",
    "passport-emergency",
    "passport-lost",
] as const;

export type AppointmentType = (typeof appointmentTypes)[number];

export interface IAppointment extends mongoose.Document {
    type: AppointmentType;
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
