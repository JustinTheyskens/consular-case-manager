import {
    Staff,
    type IStaff,
} from "../models/staff.model.ts";

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: String) => Staff.findById(id),
    create: (data: IStaff) => Staff.create(data),
    update: (id: String, data: IStaff) =>
        Staff.findByIdAndUpdate(id, data, { returnDocument: "after" }),
    delete: (id: String) => Staff.findByIdAndDelete(id),
};

export default StaffRepository;
