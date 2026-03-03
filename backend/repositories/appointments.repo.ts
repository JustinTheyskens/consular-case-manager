import { Appointment, type IAppointment } from "../models/appointments.model.ts";

import { type ClientSession, Types } from "mongoose";

/**
 * Finds and returns all appointments from the database
 * @returns A promise of all appointments in the database
 */
function findAll() {
    return Appointment.find().exec();
}

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
 * @param session The transactional session to use
 * @returns A promise with the created appointment
 */
function createAppointment(data: IAppointment, session: ClientSession) {
    return Appointment.create([data], { session: session });
}

/**
 * Deletes an appointment with given id
 * @param _id The id of the Appointment document to update
 * @param session The transactional session to use
 * @returns A promise with the delete appointment
 */
function deleteAppointment(_id: string, session: ClientSession) {
    return Appointment.findOneAndDelete({ _id: _id }).session(session).exec();
}

const AppointmentRepository = {
    findAll,
    findFutureAppointments,
    createAppointment,
    deleteAppointment,
};

export default AppointmentRepository;
