import mongoose, { Schema } from "mongoose";

export const appointmentTypes = [
    "passport-renewal",
    "passport-first",
    "passport-emergency",
    "passport-lost",
] as const;

export type AppointmentType = (typeof appointmentTypes)[number];

export interface IAppointment extends mongoose.Document {
    type: AppointmentType;
    time: Date;
}

const appointmentSchema = new Schema<IAppointment>({
    type: {
        required: true,
        type: String,
        enum: appointmentTypes,
    },

    time: {
        required: true,
        type: Date,
    },
});

export const Appointment = mongoose.model<IAppointment>(
    "Appointment",
    appointmentSchema,
    "appointments",
);
