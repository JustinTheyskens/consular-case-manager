import StaffRepository from "../repositories/staff.repo";
import { IStaff } from "../interfaces/staff.interface";

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
};
