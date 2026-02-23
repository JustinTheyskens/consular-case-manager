import { StaffService, type IStaffAccount } from "../services/staff.service.ts";
import { type Request, type Response } from "express";
import type { IStaff } from "../models/staff.model.ts";

export const StaffController = {
    getAll: async (req: Request, res: Response) => {
        try {
            res.status(200).send(await StaffService.getAll());
        } catch (error) {
            console.log("Error getting all staff.");
            console.log(error);
            res.sendStatus(404);
        }
    },
    getById: async (req: Request, res: Response) => {
        try {
            const id = String(req.params.id);

            console.log("Searching for staff member:", id);

            if (!id) {
                return res.status(400).json({ message: "Invalid staff ID" });
            }

            res.status(200).send(await StaffService.getById(id));
        } catch (error) {
            res.status(500).json({ message: `Error encountered: ${(error as Error).message}` });
        }
    },
    create: async (req: Request, res: Response) => {
        try {
            const staff = await StaffService.create(req.body);
            console.log("CREATE ITEM BODY:", req.body);

            return res.status(201).json(staff);
        } catch (error) {
            res.status(400).json({ message: `Error encountered: ${(error as Error).message}` });
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const id = String(req.params.id);
            const updatedStaff: IStaffAccount = req.body;
            res.status(201).send(await StaffService.update(id, updatedStaff));
        } catch (err) {
            return res.status(500).json({ message: (err as Error).message });
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const id = String(req.params.id);
            console.log("Deleting staff:", id);

            await StaffService.delete(id);

            return res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: `Error encountered: ${(error as Error).message}` });
        }
    },
    updateAvailabilityDay: async (req: Request, res: Response) => {
        try {
            const staffId = String(req.params.id);
            const day = String(req.params.day);
            const periods = req.body; // AvailabilityPeriod[]

            if (!staffId) {
                return res.status(400).json({ message: "Invalid staff ID" });
            }

            const updated = await StaffService.updateAvailabilityDay(staffId, day, periods);

            if (!updated) {
                return res.status(404).json({ message: "Staff not found" });
            }

            return res.status(200).json(updated);
        } catch (err) {
            return res.status(500).json({
                message: `Error updating availability: ${(err as Error).message}`,
            });
        }
    },
};
