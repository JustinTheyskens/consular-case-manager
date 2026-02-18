import app from "./app.ts";
import "dotenv/config";

import dbConnect from "./config/db.ts";

const port = process.env.PORT ?? "8080";

await dbConnect();

app.listen(port, () => {
    console.log(`Currently listening on port ${port}.`);
});
