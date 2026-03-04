import { type Request, type Response } from "express";

import AvailabilityService from "../services/availabilities.service.ts";
import { type IAvailability } from "../models/availabilities.model.ts";
import { type AppointmentType } from "../models/appointments.model.ts";

export interface AvailabilityParams {
    id: string;
}

export interface AvailabilityQuery {
    staff?: string;
}

export interface OpenTimesQuery {
    appointmentType: AppointmentType;
    startTime?: string;
}

/**
 * Handles GET /availabilities/
 */
async function getAvailabilities(
    req: Request<null, IAvailability[], null, AvailabilityQuery>,
    res: Response,
) {
    try {
        const { staff } = req.query;
        let data: IAvailability[];

        if (staff != null) {
            data = await AvailabilityService.getAvailabilitiesByStaff(staff);
        } else {
            data = await AvailabilityService.getAll();
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles GET /availabilities/times/
 */
async function getAvailablyTimes(
    req: Request<null, number[], null, OpenTimesQuery>,
    res: Response,
) {
    try {
        const { appointmentType, startTime } = req.query;

        let returnValue;

        if (startTime != null) {
            const date = new Date(Number(startTime));

            returnValue = await AvailabilityService.getAllAvailableTimes(appointmentType, date);
        } else {
            returnValue = await AvailabilityService.getAllAvailableTimes(appointmentType);
        }
        res.status(200).json(returnValue);
    } catch (error) {
        if (error instanceof RangeError) {
            return res.status(400).send({ message: error.message });
        }
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles POST /availabilities/
 */
async function createAvailability(req: Request<{}, IAvailability, IAvailability>, res: Response) {
    try {
        const data = req.body;

        const document = await AvailabilityService.createAvailability(data);
        res.status(201).json(document);
    } catch (error) {
        if (error instanceof RangeError) {
            return res.status(400).send({ message: error.message });
        }
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles PUT /availabilities/:id
 */
async function updateAvailability(
    req: Request<AvailabilityParams, IAvailability, IAvailability>,
    res: Response,
) {
    try {
        const { id } = req.params;
        const data = req.body;
        const document = await AvailabilityService.updateAvailability(id, data);
        res.status(200).json(document);
    } catch (error) {
        if (error instanceof RangeError) {
            return res.status(400).send({ message: error.message });
        }
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles DELETE /availabilities/:ref
 */
async function deleteAvailability(req: Request<AvailabilityParams>, res: Response) {
    try {
        const { id } = req.params;

        await AvailabilityService.deleteAvailability(id);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

const CaseController = {
    getAvailabilities,
    getAvailablyTimes,
    createAvailability,
    updateAvailability,
    deleteAvailability,
};

export default CaseController;
