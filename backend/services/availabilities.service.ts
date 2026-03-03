import { type AppointmentType } from "../models/appointments.model.ts";
import { type IAvailability } from "../models/availabilities.model.ts";
import AppointmentRepository from "../repositories/appointments.repo.ts";
import AvailabilityRepository from "../repositories/availabilities.repo.ts";

import config from "../config.json" with { type: "json" };
import { Types } from "mongoose";
import { Heap } from "heap-js";

const { interval, maxLookup, minWait } = config;

const INTERVAL = interval * 1_000 * 60;
const EXCLUSIVE_INTERVAL = (interval - 1) * 1_000 * 60;
const MAX_LOOKUP = maxLookup * 1_000 * 60 * 60 * 24;
const WAIT = minWait * 1_000 * 60 * 60;
const DAY = 1_000 * 60 * 60 * 24;

/**
 * Gets all availabilities from the repository
 * @returns A promise containing all availabilities found
 */
async function getAll() {
    return await AvailabilityRepository.findAll();
}

/**
 * Gets all availabilities from the repository assigned to the given staff member
 * @param staff The staff ID to find the availaiblities for
 * @returns A promise containing all availabilities found
 */
async function getAvailabilitiesByStaff(staff: string) {
    return await AvailabilityRepository.findAvailabilitiesByStaff(staff);
}

/**
 * Finds all available time slots starting at the start time
 * @param appointmentType The type of appointment to look for available times
 * @param startTime The start time to look for available times
 * @returns A promise containing an array of all available appointment unix timestamps
 */
async function getAllAvailableTimes(
    appointmentType: AppointmentType,
    startTime: Date = new Date(),
) {
    // This is probably super buggy. I hate myself.
    const availabilities =
        await AvailabilityRepository.findAvailabilitiesByAppointmentType(appointmentType);

    const times = getTimes(startTime);

    const prioQueue = new Heap<[Date, Date, IAvailability]>(
        (a, b) => a[0].getTime() - b[0].getTime(),
    );

    // Adds all availabilities to the priority queues
    for (const availability of availabilities) {
        const { startTime, endTime, dayOfWeek } = availability;
        const startDate = new Date(times[0]);
        
        const periodStart = findNextPeriod(startDate, startTime, dayOfWeek);
        const periodEnd = findNextPeriod(
            startDate,
            endTime,
            dayOfWeek + (startTime < endTime ? 0 : 1),
        );
        
        prioQueue.push([periodStart, periodEnd, availability]);
    }
    
    // Gets all appointments that could impact current availability
    const appointments = await AppointmentRepository.findFutureAppointments(
        new Date(times[0] - DAY),
    );

    console.log(appointments);

    // Map grouping appointments by staff
    const staffAppointments = new Map<string, Set<number>>();

    appointments.forEach((appointment) => {
        const { staff, time } = appointment;

        const staffId = staff.toString();
        // Add appointment to a staff map
        if (staffAppointments.get(staffId) == null) {
            staffAppointments.set(staffId, new Set());
        }
        staffAppointments.get(staffId)?.add(time.getTime());
    });

    // Preprocesses availability periods until the the last candidate
    // interval is reached
    const processedAvailabilities: [Date, Date, string][] = [];
    const lastInterval = times[times.length - 1];

    while (prioQueue.peek() && prioQueue.peek()![0].getTime() <= lastInterval) {
        const [periodStart, periodEnd, availability] = prioQueue.pop()!;
        const { staff, capacity } = availability;
        const staffId = staff.toString();

        // Process the current availability period if the capacity is not already full
        if (
            getPeriodCapacity(periodStart, periodEnd, staffAppointments.get(staffId) ?? new Set()) <
            capacity
        ) {
            processedAvailabilities.push([periodStart, periodEnd, staffId]);
        }

        // Requeue availability for next week
        const nextPeriodStart = new Date(periodStart.getTime() + 7 * DAY);
        const nextPeriodEnd = new Date(periodEnd.getTime() + 7 * DAY);

        prioQueue.push([nextPeriodStart, nextPeriodEnd, availability]);
    }

    console.log(prioQueue);
    console.log(staffAppointments);

    // Return all times such that
    // there is one open availability for the time
    // AND the availability does not already have an appointment at the same time
    return times.filter((time) => {
        return processedAvailabilities.some(([start, end, staff]) => {
            return (
                start.getTime() <= time &&
                time <= end.getTime() - EXCLUSIVE_INTERVAL &&
                !staffAppointments.get(staff)?.has(time)
            );
        });
    });
}

/**
 * Creates a new availability period with given data
 * @param data The data to populate the availability with
 * @returns A promise containing the new case file
 */
async function createAvailability(data: IAvailability) {
    const { startTime, endTime, staff, dayOfWeek } = data;
    const overlap = await AvailabilityRepository.findOverlap(
        staff.toString(),
        dayOfWeek,
        startTime,
        endTime,
    );

    if (overlap != null) {
        throw new RangeError("Availability overlaps with existing availability");
    }

    return await AvailabilityRepository.createAvailability(data);
}

/**
 * Updates an availability period with given id and data
 * @param id The id of the availability to update
 * @param data The new data of the availability
 * @returns A promise containing the updated availability
 */
async function updateAvailability(id: string, data: IAvailability) {
    const { startTime, endTime, staff, dayOfWeek } = data;
    const overlap = await AvailabilityRepository.findOverlap(
        staff.toString(),
        dayOfWeek,
        startTime,
        endTime,
        id,
    );

    if (overlap != null) {
        throw new RangeError("Availability overlaps with existing availability");
    }

    return await AvailabilityRepository.updateAvailability(id, data);
}

/**
 * Deletes an availability period with specific id
 * @param id The id of the availability period to delete
 * @returns A promise containing the availability document deleted
 */
async function deleteAvailability(id: string) {
    return await AvailabilityRepository.deleteAvailability(id);
}

/**
 * Counts the number of appointments in a given start and end of a period
 * @param startPeriod The starting timestamp of a period
 * @param endPeriod The ending timestamp of a period
 * @param appointments All appointments to check
 * @returns The number of appointments within the period
 */
function getPeriodCapacity(startPeriod: Date, endPeriod: Date, appointments: Set<number>) {
    let capacity = 0;

    for (const appointment of appointments) {
        const appointmentTime = appointment;

        if (
            startPeriod.getTime() <= appointmentTime &&
            appointmentTime <= endPeriod.getTime() - EXCLUSIVE_INTERVAL
        ) {
            capacity++;
        }
    }

    return capacity;
}

/**
 * Given an anchor datetime, converts the time of day and day of week of a schedule start/end to
 * the next available timestamp after the anchor datetime.
 * @param anchor The timestamp to set as a reference point
 * @param time The time of day, expressed in minutes after midnight UTC
 * @param dayOfWeek The day of week
 * @returns A Date object corresponding to the next instance of the weekday + time of day specified in UTC
 */
function findNextPeriod(anchor: Date, time: number, dayOfWeek: number) {
    const nextPeriod = new Date(anchor.getTime());
    const periodDayOfWeek = nextPeriod.getUTCDay();

    nextPeriod.setUTCDate(nextPeriod.getUTCDate() + ((dayOfWeek - periodDayOfWeek + 7) % 7));
    if (nextPeriod.getTime() <= anchor.getTime()) {
        nextPeriod.setUTCDate(nextPeriod.getUTCDate() + 7);
    }

    nextPeriod.setUTCHours(Math.floor(time / 60), time % 60, 0, 0);

    return nextPeriod;
}

/**
 * Generates candidate datetimes to check for availability
 * @param startTime The starting timestamp to generate intervals from
 * @returns An array of dates
 */
function getTimes(startTime: Date) {
    // Wait some hours into the future before appointments are considered
    // to prevent appointments with little notice
    const start = Math.ceil((startTime.getTime() + WAIT) / INTERVAL) * INTERVAL;
    const end = start + MAX_LOOKUP;

    const returnValue = [];

    for (let i = start; i < end; i += INTERVAL) {
        returnValue.push(i);
    }

    return returnValue;
}

// function withinInterval(
//     time: Date,
//     period: { startTime: number; endTime: number; dayOfWeek: number },
// ) {
//     const dayOfWeek = time.getUTCDay();
//     const hours = time.getUTCHours();
//     const minutes = time.getUTCMinutes();
//     const timeOfDay = 60 * hours + minutes;

//     return (
//         period.endTime >= timeOfDay + EXCLUSIVE_INTERVAL &&
//         ((period.dayOfWeek === dayOfWeek && period.startTime <= timeOfDay && period.endTime) ||
//             period.dayOfWeek === (dayOfWeek + 6) % 7)
//     );
// }

const AvailabilityService = {
    getAll,
    getAvailabilitiesByStaff,
    getAllAvailableTimes,
    createAvailability,
    updateAvailability,
    deleteAvailability,
};

export default AvailabilityService;
