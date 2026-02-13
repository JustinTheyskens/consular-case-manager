import express from "express";
import cors from "cors";
import "dotenv/config";

import logger from "./middleware/logger.ts";

const app = express();
const allowedOrigins = process.env.WHITELIST;

app.use(
    cors({
        origin: allowedOrigins,
    }),
);

app.use(express.json());

app.use(logger);

export default app;
