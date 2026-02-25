import { Types } from "mongoose";
import { Appointment, type IAppointment } from "../models/appointments.model.ts";

/**
 * Finds all appointments past a given datetime
 * @param date The datetime to find appointments for
 * @returns A sorted promise with all future appointments
 */
function findFutureAppointments(date: Date) {
    return Appointment.aggregate<{ time: Date; staff: Types.ObjectId }>([
        {
            $match: {
                time: {
                    $gte: date,
                },
            },
        },
        {
            $lookup: {
                from: "cases",
                localField: "_id",
                foreignField: "appointment",
                as: "case",
            },
        },
        {
            $project: {
                time: 1,
                staff: "case.assignedStaff",
            },
        },
    ])
        .sort("time")
        .exec();
}

/**
 * Creates a new appointment with given data
 * @param data The data of the appointment to create
 * @returns A promise with the created appointment
 */
function createAppointment(data: IAppointment) {
    return Appointment.create(data);
}

/**
 * Updates an appointment with given id
 * @param _id The id of the Appointment file to update
 * @param newData The new Appointment file data to replace the old
 * @returns A promise with the updated appointment file
 */
async function updateAppointment(_id: string, newData: IAppointment) {
    return Appointment.findByIdAndUpdate(_id, newData, { returnDocument: "after" }).exec();
}

const AppointmentRepository = {
    findFutureAppointments,
    createAppointment,
    updateAppointment,
};

export default AppointmentRepository;
