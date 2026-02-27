import mongoose, { Schema, Types } from "mongoose";

export interface ILogin extends mongoose.Document {
    email: string;
    password: string;
    type: "citizen" | "staff";
    ref: Types.ObjectId;
}

const loginSchema = new Schema<ILogin>({
    email: {
        required: true,
        unique: true,
        type: String,
    },

    password: {
        required: true,
        type: String,
    },

    type: {
        required: true,
        type: String,
        enum: ["citizen", "staff"],
    },

    ref: {
        required: true,
        type: Types.ObjectId,
        ref: function() {
            return this.type === "citizen" ? "Citizen" : "Staff";
        }
    },
});

export const Login = mongoose.model<ILogin>("Login", loginSchema, "logins");
