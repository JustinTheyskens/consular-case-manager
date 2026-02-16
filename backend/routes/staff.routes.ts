import express from "express";
import { type Request, type Response } from "express";
//TODO: CONTROLLER IMPORT

const router = express.Router();

router
    .route("/")
    .get((req: Request, res: Response) => {})
    .post(async (req: Request, res: Response) => {});

router
    .route("/:id")
    .get(async (req: Request, res: Response) => {})
    .put(async (req: Request, res: Response) => {})
    .delete(async (req: Request, res: Response) => {});

export default router;
