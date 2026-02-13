// days
export type DayOfWeek =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

// entry
export interface AvailabilityDTO {
    day: DayOfWeek;
    startTime: string;
    endTime: string;
}
