import express from "express";
import { type Request, type Response } from "express";
import AppointmentController, { type AppointmentParams } from "../controllers/appointments.controller.ts";

const router = express.Router();

router
    .route("/:id")
    .put(async (req: Request<AppointmentParams>, res: Response) => {
        AppointmentController.updateAppointment(req, res);
    });

export default router;
