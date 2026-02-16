import { Staff, IStaff } from "../models/staff.model.ts";

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: number) => Staff.findById(id),
    create: (data: IStaff) => Staff.create(data),
    update: (id: number, data: IStaff) => Staff.findByIdAndUpdate(id, data, { new: true }),
    delete: (id: number) => Staff.findByIdAndDelete(id),
};

export default StaffRepository;
