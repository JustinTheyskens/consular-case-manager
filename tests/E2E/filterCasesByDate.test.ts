// Unit Tests using Junit for the filtering function used by StaffMetricsDashboard 

import dayjs from "dayjs";
import { filterCasesByDate } from "../../frontend/src/components/StaffMetricsTimeChartHelper.ts"
import { Case } from "../../frontend/src/api/endpoints/CasesAPI.ts";

describe("filterCasesByDate", () => {
  const cases: Case[] = [

    // Entry 1 -- Today

    {
    _id: "1",
    reference: 1,
    status: "Cancelled",
    appointment: {
      type: "passport-renewal",
      time: "2026-03-05T08:00:00.000Z",  
    },
    assignedStaff: {firstName: "",lastName: "",_id: "",email: "",password: ""},citizen: {_id: "",email: "",firstName: "",lastName: "",password: "",},checkedIn: false,flagged: false,notes: "",
  },
  // Entry 2 Yesterday 
  {
    _id: "2",
    reference: 2,
    status: "Scheduled",
    appointment: {
      type: "passport-renewal",
      time: "2026-03-04T08:00:00.000Z",  
    },
    assignedStaff: {firstName: "",lastName: "",_id: "",email: "",password: ""},citizen: {_id: "",email: "",firstName: "",lastName: "",password: "",},checkedIn: false,flagged: false,notes: "",
  },
    // Entry 3 Tomorrow 
  {
    _id: "3",
    reference: 3,
    status: "Completed",
    appointment: {
      type: "passport-renewal",
      time: "2026-03-06T08:00:00.000Z",  
    },
    assignedStaff: {firstName: "",lastName: "",_id: "",email: "",password: ""},citizen: {_id: "",email: "",firstName: "",lastName: "",password: "",},checkedIn: false,flagged: false,notes: "",
  },

       // Entry 4 No Time 
  {
    _id: "3",
    reference: 3,
    status: "Completed",
    appointment: {
      type: "passport-renewal",
      time: "",  
    },
    assignedStaff: {firstName: "",lastName: "",_id: "",email: "",password: ""},citizen: {_id: "",email: "",firstName: "",lastName: "",password: "",},checkedIn: false,flagged: false,notes: "",
  }


  ];

  it("returns only cases within start/end date (inclusive)", () => {
    const start = dayjs("2026-03-01");
    const end = dayjs("2026-03-05");

    const result = filterCasesByDate(cases, start, end);

    expect(result).toHaveLength(2); // yesterday and today
    expect(result.map(c => c._id)).toEqual(["1", "2"]);
  });

  it("returns empty array if no cases match", () => {
    const start = dayjs("2025-01-01");
    const end = dayjs("2025-01-31");

    const result = filterCasesByDate(cases, start, end); 
    expect(result).toHaveLength(0); // no valid cases
  });

  it("returns cases after start date if endDate is not provided", () => {
    const start = dayjs("2026-03-05");

    const result = filterCasesByDate(cases, start);
    expect(result.map(c => c._id)).toEqual(["1", "3"]); // should include today and tomorrow 
  });

  it("ignores cases with null appointment.time", () => {
    const start = dayjs("2026-03-01");
    const end = dayjs("2026-03-31");

    const result = filterCasesByDate(cases, start, end);
    expect(result.find(c => c._id === "4")).toBeUndefined(); // shouldn't find case 4 
  });
});