import express from "express";
import { type Request, type Response } from "express";
import citizensController from "../controllers/citizens.controller.ts";

const router = express.Router();

router
    .route("/")
    .get((req: Request, res: Response) => {
        citizensController.getAllCitizens(req, res);
    })
    .post(async (req: Request, res: Response) => {
        citizensController.createCitizen(req, res);
    });

router
    .route("/:id")
    .get(async (req: Request, res: Response) => {
        let id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        citizensController.getCitizenById(req, res, id);
    })
    .put(async (req: Request, res: Response) => {
        let id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        citizensController.updateCitizen(req, res, id);
    })
    .delete(async (req: Request, res: Response) => {
        let id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        citizensController.deleteCitizen(req, res, id);
    });

export default router;
