import { MongooseError, startSession } from "mongoose";

import { type IStaff } from "../models/staff.model.ts";
import { type ILogin } from "../models/logins.model.ts";
import StaffRepository from "../repositories/staff.repo.ts";
import LoginRepository from "../repositories/logins.repo.ts";

export interface IStaffAccount extends IStaff {
    email: string;
    password: string;
}

export const StaffService = {
    getAll: async () => {
        const staff = await StaffRepository.findAll();
        return staff;
    },
    getById: async (id: string) => {
        return await StaffRepository.findById(id);
    },
    create: async (data: IStaffAccount) => {
        // Begins mongoose transaction for integrity (create both a login and staff document)
        const session = await startSession();

        try {
            return await session.withTransaction(async () => {
                const [staff] = (await StaffRepository.create(data, session)) as IStaff[];

                const { _id } = staff;
                const { email, password } = data;

                await LoginRepository.createLogin(
                    {
                        email,
                        password,
                        type: "staff",
                        ref: _id,
                    } as ILogin,
                    session,
                );

                return staff;
            });
        } catch (error: any) {
            if (error.code === 11000) {
                throw new RangeError("Email already exists");
            }
            console.error(error);
            throw new MongooseError("Internal error: could not create staff");
        } finally {
            session.endSession();
        }
    },
    update: async (id: string, data: IStaffAccount) => {
        // Begins mongoose transaction for integrity (update both a login and staff document)
        const session = await startSession();

        try {
            return await session.withTransaction(async () => {
                const staff = (await StaffRepository.update(id, data, session)) as IStaff;

                const { email, password } = data;

                await LoginRepository.updateLogin(id, { email, password } as ILogin, session);

                return staff;
            });
        } catch (error: any) {
            if (error.code === 11000) {
                throw new RangeError("Email already exists");
            }
            console.error(error);
            throw new MongooseError("Internal error: could not update staff");
        } finally {
            session.endSession();
        }
    },
    delete: async (id: string) => {
        // Begins mongoose transaction for integrity (update both a login and staff document)
        const session = await startSession();

        try {
            return await session.withTransaction(async () => {
                await LoginRepository.deleteLogin(id, session);

                return await StaffRepository.delete(id, session);
            });
        } catch (error) {
            console.error(error);
            throw new MongooseError("Internal error: could not delete staff");
        } finally {
            session.endSession();
        }
    },
    updateInfo: async (id: String, updatedStaff: IStaff) => {
        const staff = await StaffRepository.findById(id);

        if (!staff) {
            throw new Error("Staff not found");
        }

        const update: Partial<IStaff> = {};

        if (updatedStaff.firstName !== undefined) {
            update.firstName = updatedStaff.firstName;
        }

        if (updatedStaff.lastName !== undefined) {
            update.lastName = updatedStaff.lastName;
        }

        return StaffRepository.update(id, updatedStaff);
    },
    // updateAvailability: async (staffId: number, updatedStaff: IStaff) => {
    //         const staff = await StaffRepository.findById(staffId);

    //     if (!staff) {
    //         throw new Error("Staff not found");
    //     }

    //     if (!updatedStaff.availability) {
    //         throw new Error("No availability provided");
    //     }

    //     const update: Record<string, unknown> = {};

    //     for (const [day, periods] of Object.entries(updatedStaff.availability)) {
    //         update[`availability.${day}`] = periods;
    //     }

    //     return StaffRepository.update(staffId, updatedStaff);
    // },
    // updateAvailabilityDay: async (id: String, day: string, periods: AvailabilityPeriod[]) => {
    //     if (!VALID_DAYS.includes(day as Day)) {
    //         throw new Error("Invalid day");
    //     }

    //     for (const period of periods) {
    //         if (period.capacity <= 0) {
    //             throw new Error("Capacity must be greater than 0");
    //         }
    //     }

    //     if (hasOverlappingPeriods(periods)) {
    //         throw new Error("Availability periods may not overlap");
    //     }

    //     return StaffRepository.updateAvailabilityDay(id, day as Day, periods);
    // },
};
