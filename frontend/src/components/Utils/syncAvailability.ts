import axios from "axios";
import type { AppointmentType } from "../../layout/CitizenDashboardLayout";
import type { DayAvailability } from "../modals/AvailabilityModal";

const DAY_INDEX: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

export interface AvailabilityDocument {
    _id: string;
    startTime: number;
    endTime: number;
    dayOfWeek: number;
    staff: string;
    capacity: number;
    allowedAppointments: AppointmentType[];
}

export const syncAvailability = async (
    staffId: string,
    weeklyHours: Record<string, DayAvailability>,
    allowedAppointments: AppointmentType[],
) => {
    const { data: existing } = await axios.get<AvailabilityDocument[]>(
        `/availabilities?staff=${staffId}`,
    );

    // Group all records by dayOfWeek to catch duplicates
    const groupedByDay = new Map<number, AvailabilityDocument[]>();
    existing.forEach((doc) => {
        const group = groupedByDay.get(doc.dayOfWeek) ?? [];
        group.push(doc);
        groupedByDay.set(doc.dayOfWeek, group);
    });

    // For days with multiple records, delete all but the most recent one
    const cleanupRequests: Promise<unknown>[] = [];
    groupedByDay.forEach((docs) => {
        if (docs.length > 1) {
            // Keep the last one, delete the rest
            const [keep, ...duplicates] = [...docs].reverse();
            duplicates.forEach((doc) =>
                cleanupRequests.push(axios.delete(`/availabilities/${doc._id}`)),
            );
        }
    });
    await Promise.all(cleanupRequests);

    // Now safe to build a single-record-per-day map
    const existingByDay = new Map<number, AvailabilityDocument>();
    groupedByDay.forEach((docs, dayOfWeek) => {
        // After cleanup the one we kept is the last in the reversed array
        const keeper = [...docs].reverse()[0];
        existingByDay.set(dayOfWeek, keeper);
    });

    // Proceed as normal — PUT if exists, POST if not, DELETE if disabled
    const requests = Object.entries(weeklyHours).map(([day, avail]) => {
        const { enabled, startTime, endTime, capacity } = avail;
        const dayOfWeek = DAY_INDEX[day];
        const existing = existingByDay.get(dayOfWeek);

        if (enabled) {
            const payload = {
                startTime,
                endTime,
                dayOfWeek,
                staff: staffId,
                capacity,
                allowedAppointments,
            };
            return existing
                ? axios.put(`/availabilities/${existing._id}`, payload)
                : axios.post(`/availabilities/`, payload);
        } else if (existing) {
            return axios.delete(`/availabilities/${existing._id}`);
        }
        return Promise.resolve();
    });

    await Promise.all(requests);
};
