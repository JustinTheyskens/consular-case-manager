import { Staff, type IStaff } from "../models/staff.model.ts";

import { type ClientSession } from "mongoose";

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: String) => Staff.findById(id),
    create: (data: IStaff, session: ClientSession) => Staff.create([data], { session: session }),
    update: (id: String, data: IStaff, session?: ClientSession) =>
        Staff.findByIdAndUpdate(id, data, { returnDocument: "after" }).session(session ?? null),
    delete: (id: String, session?: ClientSession) => Staff.findByIdAndDelete(id).session(session ?? null),
};

export default StaffRepository;
