import express from "express";
import { type Request, type Response } from "express";
import CaseController, { type CaseParams } from "../controllers/case.controller.ts";

const router = express.Router();

router
    .route("/")
    .get(async (req: Request, res: Response) => {
        CaseController.getAllCases(req, res);
    })
    .post(async (req: Request, res: Response) => {
        CaseController.createCase(req, res);
    });

router
    .route("/:ref")
    .get(async (req: Request<CaseParams>, res: Response) => {
        CaseController.getCaseByReference(req, res);
    })
    .put(async (req: Request<CaseParams>, res: Response) => {
        CaseController.updateCase(req, res);
    })
    .delete(async (req: Request<CaseParams>, res: Response) => {
        CaseController.deleteCase(req, res);
    });

export default router;
