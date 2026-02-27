import { type Request, type Response } from "express";
import AppointmentService from "../services/appointments.service.ts";

/**
 * Handles GET /appointments/
 */
async function getAppointments(_: Request, res: Response) {
    try {
        const data = await AppointmentService.getAll();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

const AppointmentController = {
    getAppointments,
};

export default AppointmentController;
