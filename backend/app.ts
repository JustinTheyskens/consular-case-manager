import express from "express";
import cors from "cors";
import "dotenv/config";

import logger from "./middleware/logger.ts";
import casesRouter from "./routes/cases.routes.ts";
import staffRouter from "./routes/staff.routes.ts";
import citizenRouter from "./routes/citizens.routes.ts";
import appointmentRouter from "./routes/appointments.routes.ts";
import loginRouter from "./routes/logins.routes.ts";
import availabilitiesRouter from "./routes/availabilities.routes.ts";

const app = express();
const allowedOrigins = process.env.WHITELIST;

app.use(cors());

app.use(express.json());

app.use("/cases", casesRouter);
app.use("/staff", staffRouter);
app.use("/citizens", citizenRouter);
app.use("/appointments", appointmentRouter);
app.use("/login", loginRouter);
app.use("/availabilities", availabilitiesRouter);

app.use(logger);

export default app;
