import mongoose, { Schema, Types } from "mongoose";
import { type IAppointment } from "../models/appointments.model.ts";

const caseStatusTypes = ["scheduled", "in-review", "approved", "rejected", "completed"] as const;

type CaseStatus = (typeof caseStatusTypes)[number];

export interface ICase extends mongoose.Document {
    reference: number;
    status: CaseStatus;
    appointment: Types.ObjectId | IAppointment;
    assignedStaff: Types.ObjectId;
    citizen: Types.ObjectId;
    checkedIn: boolean;
    flagged: boolean;
    notes?: string;
}

const caseSchema = new Schema<ICase>({
    reference: {
        required: true,
        unique: true,
        type: Number,
    },

    status: {
        required: true,
        default: "scheduled",
        type: String,
        enum: caseStatusTypes,
    },

    appointment: {
        required: true,
        type: Types.ObjectId,
        ref: "Appointment",
    },

    assignedStaff: {
        required: true,
        type: Types.ObjectId,
        ref: "Staff",
    },

    citizen: {
        required: true,
        type: Types.ObjectId,
        ref: "Citizen",
    },

    checkedIn: {
        required: true,
        default: false,
        type: Boolean,
    },

    flagged: {
        required: true,
        default: false,
        type: Boolean,
    },

    notes: {
        required: false,
        default: "",
        type: String,
    },
});

export const Case = mongoose.model<ICase>("Case", caseSchema, "cases");
