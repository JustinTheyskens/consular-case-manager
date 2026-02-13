import {Staff} from '../models/staff.model.ts';
import { CreateStaffDTO } from '../DTOs/createStaff.DTO.ts';

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: number) => Staff.findById(id),
    create: (data: CreateStaffDTO) => Staff.create(data)
}

export default StaffRepository;