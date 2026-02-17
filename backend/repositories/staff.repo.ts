import { Staff, type IStaff, type Availability, type AvailabilityPeriod } from "../models/staff.model.ts";

export const StaffRepository = {
    findAll: () => Staff.find(),
    findById: (id: number) => Staff.findById(id),
    create: (data: IStaff) => Staff.create(data),
    update: (id: number, data: IStaff) => Staff.findByIdAndUpdate(id, data, { new: true }),
    delete: (id: number) => Staff.findByIdAndDelete(id),
    updateAvailabilityDay: (staffId: number,day: keyof Availability, periods: AvailabilityPeriod[]) => {
        return Staff.findByIdAndUpdate(staffId,
            { $set: { [`availability.${day}`]: periods } },
            { new: true } 
        );
    },
};

export default StaffRepository;
