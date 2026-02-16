import mongoose, { Schema, Types } from "mongoose";

const caseStatusTypes = ["scheduled", "in-review", "approved", "rejected", "completed"] as const;

type CaseStatus = (typeof caseStatusTypes)[number];

export interface ICase extends mongoose.Document {
    reference: number;
    status: CaseStatus;
    appointment: Types.ObjectId;
    assignedStaff: Types.ObjectId;
    citizen: Types.ObjectId;
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
        ref: "AssignedStaff",
    },

    citizen: {
        required: true,
        type: Types.ObjectId,
        ref: "Citizen",
    },

    flagged: {
        required: true,
        type: Boolean,
        default: false,
    },

    notes: {
        required: false,
        type: String,
    },
});

export const Case = mongoose.model<ICase>("Case", caseSchema, "cases");
