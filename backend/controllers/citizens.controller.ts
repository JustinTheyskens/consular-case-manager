import { type ICitizen } from "../models/citizens.model.ts";
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

async function createCitizen(req: Request, res: Response) {
    try {
        const newCitizen: ICitizen = req.body;
        res.status(201).send(await citizenService.createCitizen(newCitizen));
    } catch (error) {
        console.log("Error creating citizen.");
        console.log(error);
        res.sendStatus(400);
    }
}

async function updateCitizen(req: Request, res: Response, id: string) {
    try {
        const updatedCitizen: ICitizen = req.body;
        res.status(200).send(await citizenService.updateCitizen(id, updatedCitizen));
    } catch (error) {
        console.log("Error getting all citizens.");
        console.log(error);
        res.sendStatus(404);
    }
}

async function deleteCitizen(req: Request, res: Response, id: string) {
    try {
        await citizenService.deleteCitizen(id);
        res.sendStatus(204);
    } catch (error) {
        console.log("Error getting all citizens.");
        console.log(error);
        res.sendStatus(404);
    }
}

export default { getAllCitizens, getCitizenById, createCitizen, updateCitizen, deleteCitizen };
