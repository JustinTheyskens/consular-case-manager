import { Availability, type IAvailability } from "../models/availabilities.model.ts";
import { type AppointmentType } from "../models/appointments.model.ts";

/**
 * Finds and returns all populated availabilities from the database
 * @returns A promise of all availabilities in the database
 */
function findAll() {
    return Availability.find().exec();
}

/**
 * Finds and returns all populated availabilities from the database assigned to the given staff member
 * @returns A promise of all the staff's availabilities in the database
 */
function findAvailabilitiesByStaff(staff: string) {
    return Availability.find({ staff: staff }).exec();
}

/**
 * Finds all current availabilities for a given appointment type from the database
 * @param appointmentType The appointment type to look up the availability for
 *
 * @returns A promise of all availabilities for given appointment type
 */
function findAvailabilitiesByAppointmentType(appointmentType: AppointmentType) {
    return Availability.find({ allowedAppointments: appointmentType }).exec();
}

/**
 * Finds all current availabilities for a given appointment type and time from the database
 * @param appointmentType The appointment type to look up the availability for
 * @param dayOfWeek The day of week of the appointment
 * @param time The time of the appointment
 * @param interval The length of an appointment in ms
 *
 * @returns A promise of all availabilities for given appointment type and time
 */
function findAvailabilitiesByAppointmentTypeAndTime(
    appointmentType: AppointmentType,
    dayOfWeek: number,
    time: number,
    interval: number,
) {
    return Availability.find({
        allowedAppointments: appointmentType,
        $or: [
            {
                dayOfWeek: dayOfWeek,
                startTime: {
                    $lte: time,
                },
                endTime: {
                    $gte: time + interval,
                },
            },
            {
                dayOfWeek: (dayOfWeek + 6) % 7,
                endTime: {
                    $gte: time + interval,
                },
                $expr: { $gt: ["startTime", "endTime"] },
            },
        ],
    });
}

/**
 * Finds all overlapping availabilities with a given staff, day of week, and times of day.
 * @param staff The staff to check for overlaps
 * @param dayOfWeek The day of week to check for overlaps
 * @param startTime The start time to check for overlaps
 * @param endTime The end time to check for overlaps
 *
 * @returns A promise of an overlapping availability (if any)
 */
function findOverlap(
    staff: string,
    dayOfWeek: number,
    startTime: number,
    endTime: number,
    _id: string = "000000000000000000000000",
) {
    return Availability.findOne({
        _id: {
            $ne: _id,
        },
        staff: staff,
        $or: [
            {
                dayOfWeek: dayOfWeek,
                $or: [
                    {
                        startTime: { $lte: startTime },
                        endTime: { $gt: startTime },
                    },
                    {
                        startTime: { $lte: endTime },
                        endTime: { $gt: endTime },
                    },
                ],
            },
            {
                dayOfWeek: (dayOfWeek + 6) % 7,
                endTime: { $gte: startTime },
                $expr: { $gt: ["$startTime", "$endTime"] },
            },
        ],
    }).exec();
}

/**
 * Creates a new availability with given data
 * @param data The data of the availability to create
 * @returns A promise with the created availability
 */
function createAvailability(data: IAvailability) {
    return Availability.create(data);
}

/**
 * Updates an availability file with given reference number
 * @param _id The id of the availability file to update
 * @param newData The new availability data to replace the old
 * @returns A promise with the updated availability
 */
async function updateAvailability(_id: string, newData: IAvailability) {
    return Availability.findOneAndUpdate({ _id: _id }, newData, { returnDocument: "after" }).exec();
}

/**
 * Deletes an availability with given reference number
 * @returns A promise with the deleted availability
 */
function deleteAvailability(_id: string) {
    return Availability.findOneAndDelete({ _id: _id }).exec();
}

const AvailabilityRepository = {
    findAll,
    findAvailabilitiesByStaff,
    findAvailabilitiesByAppointmentType,
    findAvailabilitiesByAppointmentTypeAndTime,
    findOverlap,
    createAvailability,
    updateAvailability,
    deleteAvailability,
};

export default AvailabilityRepository;
