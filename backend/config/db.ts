import mongoose from "mongoose";
import "dotenv/config";

export default async function dbConnect() {
    const environment = process.env.NODE_ENV ?? "dev";
    const dbUrl =
        (environment === "test" ? process.env.MONGO_TEST_URL : process.env.MONGO_URL) ??
        "mongodb://127.0.0.1:27017/";

    try {
        await mongoose.connect(dbUrl);
        console.log(`Connected to db at ${dbUrl}`);
    } catch (error) {
        console.error(`Failed to connect to ${dbUrl}. Error: ${error})`);
        process.exit(1);
    }
}
