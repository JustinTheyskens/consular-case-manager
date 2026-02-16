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
    create: async(req: Request, res: Response) => {
        try 
        {
            const item = await StaffService.create(req.body);

            console.log('CREATE ITEM BODY:', req.body)

            return res.status(201).json(item);
        } 
        catch (error) 
        {
            res.status(400).json({message : `Error encountered: ${(error as Error).message}`});
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const staffId = Number(req.params.id);

            if ("availability" in req.body) {
                const updated = await StaffService.updateAvailability(
                    staffId,
                    req.body.availability
                );

                return res.status(200).json(updated);
            }

            const updated = await StaffService.updateInfo(staffId, req.body);

            return res.status(200).json(updated);
        } catch (err) {
            return res.status(500).json({message: (err as Error).message,});
        }
    },
    delete: async(req: Request, res: Response) => {
        try
        {
            const id = Number(req.params.id);

            console.log("Deleting staff:", id);

            await StaffService.delete(id);

            return res.status(204).send();

        }
        catch (error)
        {
            res.status(500).json({message : `Error encountered: ${(error as Error).message}`});
        } 
    },
    updateAvailabilityDay: async (req: Request, res: Response) => {
        try {
            const staffId = Number(req.params.id);
            const day = String(req.params.day);
            const periods = req.body; // AvailabilityPeriod[]

            if (Number.isNaN(staffId)) {
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
    }

};
