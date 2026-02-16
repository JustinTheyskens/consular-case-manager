import citizenService from "../services/citizens.service.ts";
import { type Request, type Response } from "express";

async function getAllCitizens(req: Request, res: Response) {
    try {
        res.status(200).send(await citizenService.getAllCitizens());
    } catch (error) {
        console.log("Error getting all citizens.");
        console.log(error);
        res.sendStatus(404);
    }
}

async function getCitizenById(req: Request, res: Response, id: string) {
    try {
        res.status(200).send(await citizenService.getCitizenById(id));
    } catch (error) {
        console.log("Error getting all citizens.");
        console.log(error);
        res.sendStatus(404);
    }
}

export default { getAllCitizens, getCitizenById };
