import { type ICase } from "../models/cases.model.ts";
import { type IAppointment } from "../models/appointments.model.ts";
import CaseRepository from "../repositories/cases.repo.ts";
import AvailabilityRepository from "../repositories/availabilities.repo.ts";
import AppointmentRepository from "../repositories/appointments.repo.ts";
import config from "../config.json" with { type: "json" };

import { startSession, Types } from "mongoose";

export interface NewCaseInfo {
    appointment: IAppointment;
    citizen: string;
}

/**
 * Gets all cases from the repository
 * @returns A promise containing all case files found
 */
async function getAll() {
    return await CaseRepository.findAll();
}

/**
 * Gets all cases from the repository assigned to the given staff member
 * @param staff The staff ID to find the cases for
 * @returns A promise containing all case files found
 */
async function getCasesByStaff(staff: string) {
    return await CaseRepository.findCasesByStaff(staff);
}

/**
 * Gets all cases from the repository belonging to the given citizen
 * @param citizen The citizen ID to find the cases for
 * @returns A promise containing all case files found
 */
async function getCasesByCitizen(citizen: string) {
    return await CaseRepository.findCasesByCitizen(citizen);
}

/**
 * Gets a case file with specific reference number
 * @param ref The reference number of the case to search
 * @returns A promise containing the case file found
 */
async function getCaseByReference(ref: number) {
    return await CaseRepository.findCaseByRef(ref);
}

/**
 * Creates a new case file with given data
 * @param data The data to populate the case file with
 * @returns A promise containing the new case file
 */
async function createCase(data: NewCaseInfo) {
    // Begins mongoose transaction for integrity (atomically transfer items)
    const session = await startSession();

    try {
        return await session.withTransaction(async () => {
            const { refLength } = config;

            // First creates an appointment
            const { appointment, citizen } = data;
            const appointmentDetails = appointment as IAppointment;

            const staff = await assignAppointmentStaff(appointmentDetails);
            const [{ _id }] = await AppointmentRepository.createAppointment(
                appointmentDetails,
                session,
            );

            return await CaseRepository.createCase(
                {
                    citizen: new Types.ObjectId(citizen),
                    appointment: _id,
                    assignedStaff: staff,
                    reference: Math.floor(Math.random() * Math.pow(10, refLength + 1)) + 1,
                },
                session,
            );
        });
    } catch (error) {
        console.error(error);
        throw new Error("Case creation was attempted but was unsuccessful");
    } finally {
        await session.endSession();
    }
}

/**
 * Updates a case file with given reference number and data
 * @param ref The reference number of the case to search
 * @param data The new data of the case file
 * @returns A promise containing the updated case file
 */
async function updateCase(ref: number, data: ICase) {
    const { appointment: newAppointment, reference } = data;
    const { time: newTime, type: newType } = newAppointment as IAppointment;

    const { appointment: oldAppointment } = (await CaseRepository.findCaseByRef(
        reference,
    )) as ICase;
    const { _id: oldId, time: oldTime, type: oldType } = oldAppointment as IAppointment;

    // Appointments are the same - skip new appointment creation
    if (newTime.getTime() === oldTime.getTime() && newType === oldType) {
        return await CaseRepository.updateCase(ref, data);
    }

    // Otherwise, appointment needs to be remade and reassigned
    const session = await startSession();

    try {
        return await session.withTransaction(async () => {
            // Creates a new appointment with the new specifications
            const appointmentDetails = newAppointment as IAppointment;

            const staff = await assignAppointmentStaff(appointmentDetails);
            const [{ _id }] = await AppointmentRepository.createAppointment(
                appointmentDetails,
                session,
            );

            await AppointmentRepository.deleteAppointment(oldId.toString(), session);

            return await CaseRepository.updateCase(
                ref,
                {
                    ...data,
                    appointment: _id,
                    assignedStaff: staff,
                } as ICase,
                session,
            );
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await session.endSession();
    }
}

/**
 * Deletes a case file with specific reference number
 * @param ref The reference number of the case to delete
 * @returns A promise containing the case file deleted
 */
async function deleteCase(ref: number) {
    // Otherwise, appointment needs to be remade and reassigned
    const session = await startSession();

    try {
        return await session.withTransaction(async () => {
            const deletedCase = await CaseRepository.deleteCase(ref, session);

            if (deletedCase != null) {
                const { appointment } = deletedCase;

                await AppointmentRepository.deleteAppointment(
                    (appointment as Types.ObjectId).toString(),
                    session,
                );
            }

            return deletedCase;
        });
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await session.endSession();
    }
}

/**
 * Finds and returns a free staff member who is able to take the given appointment
 * @param appointment The appointment to find a staff member for
 * @returns A promise of the ID of the staff member assigned to the appointment
 */
async function assignAppointmentStaff(appointment: IAppointment) {
    const { interval } = config;
    const { type, time } = appointment;
    const dayOfWeek = time.getUTCDay();
    const timeOfDay = time.getHours() * 60 + time.getMinutes();

    // Finds all availabilities that overlap with the desired appointment time
    const availabilities = await AvailabilityRepository.findAvailabilitiesByAppointmentTypeAndTime(
        type,
        dayOfWeek,
        timeOfDay,
        (interval - 1) * 1_000 * 60,
    );

    const staffAvailabilities: [Types.ObjectId, number, number][] = [];

    for (const availability of availabilities) {
        const { startTime, endTime, staff, capacity } = availability;
        let alreadyBooked = false;
        let remainingCapacity = capacity;

        const [startPeriod, endPeriod] = getPeriods(startTime, endTime, time);

        // Get all pre-existing appointment times that fall within the window.
        const availabilityAppointments = await CaseRepository.findCasesByTimeAndStaff(
            staff.toString(),
            startPeriod,
            endPeriod,
        );

        for (const otherAppointment of availabilityAppointments) {
            if (time.getTime() === otherAppointment.time.getTime()) {
                alreadyBooked = true;
                break;
            }

            remainingCapacity--;
        }

        // If the staff already has an appointment booked at the exact time,
        // reject the availability period no matter the capacity
        // Similarly, if the appointment period is already at maximum capacity,
        // reject the availability period.
        if (!alreadyBooked && remainingCapacity > 0) {
            // Otherwise, add the staff as a candidate to take the appointment
            staffAvailabilities.push([staff, remainingCapacity, capacity]);
        }
    }

    if (staffAvailabilities.length < 1) {
        throw new RangeError("No valid staff for given appointment.");
    }

    // Sort by highest current capacity remaining - if equal, sort by lowest total capacity
    staffAvailabilities.sort((a, b) => {
        return b[1] - a[1] || a[2] - b[2];
    });

    return staffAvailabilities[0][0];
}

/**
 * Anchors a start and end time to a given datetime
 * @param startTime The number of minutes since midnight of the period start
 * @param endTime The number of minutes since midnight of the period end
 * @param anchor The date to anchor the period at
 * @returns A tuple of two datetimes as the start and end of the period
 */
function getPeriods(startTime: number, endTime: number, anchor: Date) {
    const MS_PER_DAY = 1_000 * 60 * 60 * 24;
    const startOffset = startTime * 1_000 * 60;
    const endOffset = endTime * 1_000 * 60;

    return [
        new Date(
            (Math.floor(anchor.getTime() / MS_PER_DAY) - (startTime < endTime ? 0 : 1)) *
                MS_PER_DAY +
                startOffset,
        ),
        new Date(Math.floor(anchor.getTime() / MS_PER_DAY) * MS_PER_DAY + endOffset),
    ];
}

const CaseService = {
    getAll,
    getCasesByStaff,
    getCasesByCitizen,
    getCaseByReference,
    createCase,
    updateCase,
    deleteCase,
};

export default CaseService;
