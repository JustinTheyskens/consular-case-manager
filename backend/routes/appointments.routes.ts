import express from "express";
import { type Request, type Response } from "express";
import AppointmentController from "../controllers/appointments.controller.ts";

const router = express.Router();

router
    .route("/")
    .get(async (req: Request, res: Response) => {
        AppointmentController.getAppointments(req, res);
    });

export default router;
