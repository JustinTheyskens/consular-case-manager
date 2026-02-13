import { Staff } from "../models/staff.model.ts";
import { IStaff } from "../interfaces/staff.interface.ts";

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: number) => Staff.findById(id),
    create: (data: IStaff) => Staff.create(data),
};

export default StaffRepository;
