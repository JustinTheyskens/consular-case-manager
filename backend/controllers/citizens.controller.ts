import citizenService from "../services/citizens.service";
import { type Request, type Response } from "express";

async function getAllCitizens(req: Request, res: Response) {
    let allCitizens;

    try {
        let allCitizens = await citizenService.getAllCitizens();
    } catch (error) {
        console.log("Error getting all citizens.");
        console.log(error);
        res.sendStatus(404);
    }

    res.status(200).send(allCitizens);
}

async function getCitizenById(req: Request, res: Response, id: string) {
    let citizen;

    try {
        citizen = await citizenService.getCitizenById(id);
    } catch (error) {
        console.log("Error getting all citizens.");
        console.log(error);
        res.sendStatus(404);
    }

    res.status(200).send(citizen);
}

export default { getAllCitizens, getCitizenById };
