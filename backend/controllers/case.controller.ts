import { type Request, type Response } from "express";
import CaseService from "../services/case.service.ts";
import { type ICase } from "../models/case.model.ts";

interface CaseParams {
    ref: string;
}

/**
 * Handles GET /api/v1/cases/
 */
async function getAllCases(_: Request, res: Response) {
    try {
        const data = await CaseService.getAll();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles GET /api/v1/cases/:ref
 */
async function getCaseByReference(req: Request<CaseParams>, res: Response) {
    try {
        const { ref } = req.params;
        const data = await CaseService.getCaseByReference(Number(ref));

        if (!data) {
            return res.sendStatus(404);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles POST /api/v1/cases/
 */
async function createCase(req: Request<{}, ICase, ICase>, res: Response) {
    try {
        const data = req.body;

        const document = await CaseService.createCase(data);
        res.status(201).json(document);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles PUT /api/v1/cases/:ref
 */
async function updateCase(req: Request<CaseParams, ICase, ICase>, res: Response) {
    try {
        const { ref } = req.params;
        const data = req.body;
        const document = await CaseService.updateCase(Number(ref), data);
        res.status(200).json(document);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles DELETE /api/v1/cases/:ref
 */
async function deleteCase(req: Request<CaseParams>, res: Response) {
    try {
        const { ref } = req.params;

        await CaseService.deleteCase(Number(ref));
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

const CaseController = {
    getAllCases,
    getCaseByReference,
    createCase,
    updateCase,
    deleteCase,
};

export default CaseController;
