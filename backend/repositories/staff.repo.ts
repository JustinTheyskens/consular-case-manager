import {
    Staff,
    type IStaff,
    type Availability,
    type AvailabilityPeriod,
} from "../models/staff.model.ts";

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: String) => Staff.findById(id),
    create: (data: IStaff) => Staff.create(data),
    update: (id: String, data: IStaff) =>
        Staff.findByIdAndUpdate(id, data, { returnDocument: "after" }),
    delete: (id: String) => Staff.findByIdAndDelete(id),
    updateAvailabilityDay: (
        staffId: String,
        day: keyof Availability,
        periods: AvailabilityPeriod[],
    ) => {
        return Staff.findByIdAndUpdate(
            staffId,
            { $set: { [`availability.${day}`]: periods } },
            { new: true },
        );
    },
};

export default StaffRepository;
