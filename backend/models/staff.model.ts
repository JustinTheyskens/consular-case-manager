import mongoose, { Schema } from "mongoose";
import { appointmentTypes } from "./appointment.model.ts";

/**
 * Represents a period of availability on a given day
 */
export interface AvailabilityPeriod {
    startTime: string;
    endTime: string;
    capacity: number;
    allowedAppointments: (typeof appointmentTypes)[number][];
}

/**
 * Represents a full weekly availability schedule
 */
export interface Availability {
    sunday: AvailabilityPeriod[];
    monday: AvailabilityPeriod[];
    tuesday: AvailabilityPeriod[];
    wednesday: AvailabilityPeriod[];
    thursday: AvailabilityPeriod[];
    friday: AvailabilityPeriod[];
    saturday: AvailabilityPeriod[];
}

export interface IStaff extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    availability: Availability;
}

const availabilityPeriodSchema = new Schema<AvailabilityPeriod>({
    startTime: {
        required: true,
        type: String,
    },

    endTime: {
        required: true,
        type: String,
    },

    capacity: {
        required: true,
        type: Number,
    },

    allowedAppointments: {
        required: true,
        type: [String],
    },
});

const availabilitySchema = new Schema<Availability>({
    sunday: {
        required: true,
        type: [availabilityPeriodSchema],
    },

    monday: {
        required: true,
        type: [availabilityPeriodSchema],
    },

    tuesday: {
        required: true,
        type: [availabilityPeriodSchema],
    },

    wednesday: {
        required: true,
        type: [availabilityPeriodSchema],
    },

    thursday: {
        required: true,
        type: [availabilityPeriodSchema],
    },

    friday: {
        required: true,
        type: [availabilityPeriodSchema],
    },

    saturday: {
        required: true,
        type: [availabilityPeriodSchema],
    },
});

const staffSchema = new Schema<IStaff>({
    email: {
        required: true,
        type: String,
    },

    password: {
        required: true,
        type: String,
    },

    firstName: {
        required: true,
        type: String,
    },

    lastName: {
        required: true,
        type: String,
    },

    availability: {
        required: true,
        type: availabilitySchema,
    },
});

export const Staff = mongoose.model<IStaff>("Staff", staffSchema, "staff");
