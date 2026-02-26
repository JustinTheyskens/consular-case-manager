import mongoose, { Schema, Types } from "mongoose";
import { appointmentTypes, type AppointmentType } from "./appointments.model.ts";

export interface IAvailability {
    startTime: number;
    endTime: number;
    dayOfWeek: number;
    allowedAppointments: AppointmentType[];
    capacity: number;
    staff: Types.ObjectId;
}

const availabilitySchema = new Schema<IAvailability>({
    startTime: {
        required: true,
        type: Number,
        min: 0,
        max: 60 * 24 - 1,
    },

    endTime: {
        required: true,
        type: Number,
        min: 0,
        max: 60 * 24 - 1,
        validator: {
            validate: function (this: IAvailability, value: number) {
                return this.startTime == null || this.startTime !== value;
            },
            message: "Start time cannot be equal to end time!",
        },
    },

    dayOfWeek: {
        required: true,
        type: Number,
        min: 0,
        max: 6,
    },
    
    allowedAppointments: {
        required: true,
        type: [String],
        enum: appointmentTypes,
        validate: {
            validator: (value: string[]) => {
                return (
                    value.length > 0 &&
                    value.length <= appointmentTypes.length &&
                    new Set(value).size === value.length
                );
            },
            message: "Appointments must be unique and non-empty!",
        },
    },

    capacity: {
        required: true,
        type: Number,
        min: 1
    },

    staff: {
        required: true,
        type: Types.ObjectId,
        ref: "Staff",
    },
});

export const Availability = mongoose.model<IAvailability>(
    "Availability",
    availabilitySchema,
    "availabilities",
);
