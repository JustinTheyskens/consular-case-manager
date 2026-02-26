import express from "express";
import { type Request, type Response } from "express";
import AvailabilityController, {
    type AvailabilityParams,
    type AvailabilityQuery,
    type OpenTimesQuery,
} from "../controllers/availabilities.controller.ts";
import { type IAvailability } from "../models/availabilities.model.ts";

const router = express.Router();

router
    .route("/")
    .get(async (req: Request<null, IAvailability[], null, AvailabilityQuery>, res: Response) => {
        AvailabilityController.getAvailabilities(req, res);
    })
    .post(async (req: Request, res: Response) => {
        AvailabilityController.createAvailability(req, res);
    });

router
    .route("/times")
    .get(async (req: Request<null, number[], null, OpenTimesQuery>, res: Response) => {
        AvailabilityController.getAvailablyTimes(req, res);
    });

router
    .route("/:id")
    .put(async (req: Request<AvailabilityParams>, res: Response) => {
        AvailabilityController.updateAvailability(req, res);
    })
    .delete(async (req: Request<AvailabilityParams>, res: Response) => {
        AvailabilityController.deleteAvailability(req, res);
    });

export default router;
