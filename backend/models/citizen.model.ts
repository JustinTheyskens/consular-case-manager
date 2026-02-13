import mongoose, { Schema } from "mongoose";

export interface ICitizen {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}

const citizenSchema = new Schema<ICitizen>({
    email: {
        required: true,
        type: String,
    },

    password: {
        required: true,
        type: String
    },

    firstName: {
        required: true,
        type: String
    },

    lastName: {
        required: true,
        type: String
    }
});

export const Citizen = mongoose.model<ICitizen>("Citizen", citizenSchema, "citizens");
