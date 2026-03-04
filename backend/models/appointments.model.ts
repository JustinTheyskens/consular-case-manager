import mongoose, { Schema } from "mongoose";

export const appointmentTypes = [
    "passport-renewal",
    "passport-first",
    "passport-emergency",
    "passport-lost",
] as const;

export const appointmentStatuses = [
    "scheduled",
    "in-review",
    "approved",
    "rejected",
    "completed",
] as const;

export type AppointmentType = (typeof appointmentTypes)[number];
export type AppointmentStatus = (typeof appointmentStatuses)[number];

export interface IAppointment extends mongoose.Document {
    type: AppointmentType;
    time: Date;
    status: AppointmentStatus;
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

    status: {
        required: true,
        type: String,
        enum: appointmentStatuses,
        default: "scheduled",
    },
});

export const Appointment = mongoose.model<IAppointment>(
    "Appointment",
    appointmentSchema,
    "appointments",
);
