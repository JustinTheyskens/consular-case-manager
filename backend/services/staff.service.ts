import StaffRepository from "../repositories/staff.repository";
import { CreateStaffDTO } from "../DTOs/createStaff.DTO";

export const StaffService = {
            getAll: async () => {
    
                const items = await StaffRepository.findAll();
                return items;
            },
        
            getById: async (id: number) => {
                return await StaffRepository.findById(id);
            },
            create : async (data: CreateStaffDTO) => {
                return await StaffRepository.create(data);
            },
}