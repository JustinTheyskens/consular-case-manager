import { Router } from "express";

const router = Router();

router.use((req, _, next) => {
    const { ["user-agent"]: userAgent } = req.headers;

    console.log(`REQUEST> Requester: ${userAgent} | Type: ${req.method} | Endpoint: ${req.url}`);
    next();
});

export default router;