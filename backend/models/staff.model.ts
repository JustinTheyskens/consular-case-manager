import mongoose, { Schema } from "mongoose";

export interface IStaff extends mongoose.Document {
    firstName: string;
    lastName: string;
}

const staffSchema = new Schema<IStaff>({
    firstName: {
        required: true,
        type: String,
    },

    lastName: {
        required: true,
        type: String,
    },
});

staffSchema.virtual("availability", {
    ref: "Availability",
    localField: "_id",
    foreignField: "staff",
});

export const Staff = mongoose.model<IStaff>("Staff", staffSchema, "staff");
