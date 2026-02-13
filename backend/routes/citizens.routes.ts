import express from "express";
//TODO: CONTROLLER IMPORT

const router = express.Router();

router
    .route("/")
    .get((req: Express.Request, res: Express.Response) => {})
    .post(async (req: Express.Request, res: Express.Response) => {});

router
    .route("/:id")
    .get(async (req: Express.Request, res: Express.Response) => {})
    .put(async (req: Express.Request, res: Express.Response) => {})
    .delete(async (req: Express.Request, res: Express.Response) => {});

export default router;
