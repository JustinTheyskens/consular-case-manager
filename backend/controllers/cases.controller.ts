import { type Request, type Response } from "express";
import CaseService from "../services/cases.service.ts";
import { type ICase } from "../models/cases.model.ts";

export interface CaseParams {
    ref: string;
}

export interface CaseQuery {
    staff?: string,
    citizen?: string
}

/**
 * Handles GET /cases/
 */
async function getAllCases(req: Request<null, ICase[], null, CaseQuery>, res: Response) {
    try {
        const { staff, citizen } = req.query;
        let data: ICase[];

        if (staff != null) {
            data = await CaseService.getCasesByStaff(staff);
        } else if (citizen != null) {
            data = await CaseService.getCasesByCitizen(citizen);
        } else {
            data = await CaseService.getAll();
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles GET /cases?staff=
 */
async function getCasesByStaff(_: Request, res: Response) {
    try {
        const data = await CaseService.getAll();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles GET /cases?citizen=
 */
async function getCasesByCitizen(_: Request, res: Response) {
    try {
        const data = await CaseService.getAll();
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

/**
 * Handles GET /cases/:ref
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
 * Handles POST /cases/
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
 * Handles PUT /cases/:ref
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
 * Handles DELETE /cases/:ref
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
    getCasesByStaff,
    getCasesByCitizen,
    getCaseByReference,
    createCase,
    updateCase,
    deleteCase,
};

export default CaseController;
