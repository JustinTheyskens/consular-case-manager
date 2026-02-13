import { StaffService } from "../services/staff.service";
import { Request, Response } from "express";

export const StaffController = {
    getAll: async (req: Request, res: Response) => {
        const staff = StaffService.getAll();
        res.json(staff);
    },
};
