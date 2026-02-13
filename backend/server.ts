import app from "./app.ts";
import "dotenv/config";

import dbConnect from "./config/db.ts";

const port = process.env.PORT ?? "8080";

//Cases Routes
import casesRouter from "./routes/cases.routes.ts";
app.use("/cases", casesRouter);

//Staff Routes
import staffRouter from "./routes/staff.routes.ts";
app.use("/staff", staffRouter);

//Citizen Routes
import citizenRouter from "./routes/citizens.routes.ts";
app.use("/citizens", citizenRouter);

await dbConnect();

app.listen(port, () => {
    console.log(`Currently listening on port ${port}.`);
});
