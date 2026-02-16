import { StaffService } from "../services/staff.service";
import { Request, Response } from "express";

export const StaffController = {
    getAll: async (req: Request, res: Response) => {
        const staff = StaffService.getAll();
        res.json(staff);
    },
    getById: async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

            console.log("Searching for staff member:", id);

            if (Number.isNaN(id)) {
                return res.status(400).json({ message: "Invalid staff ID" });
            }

            const staff = await StaffService.getById(id);

            if (!staff) {
                return res.status(404).json({ message: `No staff member found with ID: ${id}` });
            }

            return res.status(200).json(staff);
        } catch (error) {
            res.status(500).json({ message: `Error encountered: ${(error as Error).message}` });
        }
    },
};
