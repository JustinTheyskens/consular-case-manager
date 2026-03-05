import dayjs from "dayjs";
import type { Case } from "../api/endpoints/CasesAPI";

/**
 * Filters cases by a start and optional end date (inclusive).
 * If endDate is null or undefined, includes all cases from startDate onward.
 */
export function filterCasesByDate(
  cases: Case[] | undefined,
  startDate: dayjs.Dayjs | null,
  endDate?: dayjs.Dayjs | null,
): Case[] {
  if (!cases || !startDate) {
    console.log("No Cases found or no Start Date Set");
    return [];
  }

  const start = startDate.startOf("day");
  const end = endDate?.startOf("day");

  return cases.filter((c) => {
    const time = c.appointment?.time ?? null;
    if (!time) return false; // skip null appointments

    const date = dayjs(time).startOf("day");

    if (!end) return date.isSame(start, "day") || date.isAfter(start, "day");

    return (
      date.isSame(start, "day") ||
      date.isSame(end, "day") ||
      (date.isAfter(start, "day") && date.isBefore(end, "day"))
    );
  });
}
