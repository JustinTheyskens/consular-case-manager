import StaffRepository from "../repositories/staff.repo.ts";
import { IStaff, Availability, AvailabilityPeriod } from "../models/staff.model.ts";

const VALID_DAYS = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
] as const;

type Day = (typeof VALID_DAYS)[number];

// Check for overlapping time periods
function hasOverlappingPeriods(periods: AvailabilityPeriod[]): boolean {
    const sorted = [...periods].sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].startTime < sorted[i - 1].endTime) {
            return true;
        }
    }

    return false;
}

type StaffInfoUpdates = Partial<Pick<IStaff, "firstName" | "lastName" | "email" | "password">>;

export const StaffService = {
    getAll: async () => {
        const items = await StaffRepository.findAll();
        return items;
    },
    getById: async (id: number) => {
        return await StaffRepository.findById(id);
    },
    create: async (data: IStaff) => {
        return await StaffRepository.create(data);
    },
    update: async (id: number, data: IStaff) => {
        return await StaffRepository.update(id, data);
    },
    delete: async (id: number) => {
        return await StaffRepository.delete(id);
    },
    updateInfo: async (staffId: number, updatedStaff: IStaff) => {
        const staff = await StaffRepository.findById(staffId);

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

        if (updatedStaff.email !== undefined) {
            update.email = updatedStaff.email;
        }

        if (updatedStaff.password !== undefined) {
            update.password = updatedStaff.password;
        }

        return StaffRepository.update(staffId, updatedStaff);
    },
    updateAvailability: async (staffId: number, updatedStaff: IStaff) => {
            const staff = await StaffRepository.findById(staffId);

        if (!staff) {
            throw new Error("Staff not found");
        }

        if (!updatedStaff.availability) {
            throw new Error("No availability provided");
        }

        const update: Record<string, unknown> = {};

        for (const [day, periods] of Object.entries(updatedStaff.availability)) {
            update[`availability.${day}`] = periods;
        }

        return StaffRepository.update(staffId, updatedStaff);
    },
    updateAvailabilityDay: async (staffId: number, day: string, periods: AvailabilityPeriod[]) => {
        if (!VALID_DAYS.includes(day as Day)) {
            throw new Error("Invalid day");
        }

        for (const period of periods) {
            if (period.capacity <= 0) {
                throw new Error("Capacity must be greater than 0");
            }
        }

        if (hasOverlappingPeriods(periods)) {
            throw new Error("Availability periods may not overlap");
        }

        return StaffRepository.updateAvailabilityDay(staffId, day as Day, periods);
    },
};
