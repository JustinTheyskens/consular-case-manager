import mongoose, { Schema } from "mongoose";

export interface ICitizen extends mongoose.Document {
    firstName: string;
    lastName: string;
}

const citizenSchema = new Schema<ICitizen>({
    firstName: {
        required: true,
        type: String,
    },

    lastName: {
        required: true,
        type: String,
    },
});

export const Citizen = mongoose.model<ICitizen>("Citizen", citizenSchema, "citizens");
