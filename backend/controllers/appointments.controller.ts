import { type Request, type Response } from "express";
import { type IAppointment } from "../models/appointments.model.ts";
import AppointmentService from "../services/appointments.service.ts";

export interface AppointmentParams {
    id: string;
}

/**
 * Handles PUT /appointments/:id
 */
async function updateAppointment(
    req: Request<AppointmentParams, IAppointment, IAppointment>,
    res: Response,
) {
    try {
        const { id } = req.params;
        const data = req.body;
        const document = await AppointmentService.updateAppointment(id, data);
        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

const AppointmentController = {
    updateAppointment,
};

export default AppointmentController;
