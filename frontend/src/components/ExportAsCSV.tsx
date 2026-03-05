import type { Case } from "../api/endpoints/CasesAPI";

export function exportAsCSV(cases: Case[], csvType : string) {
  const headers = [
    "Reference",
    "Status",
    "Appointment Time",
    "Citizen Name",
    "Assigned Staff",
    "Checked In",
    "Flagged",
    "Notes",
  ];

  const rows = cases.map((c) => [
    c.reference,
    c.status,
    c.appointment?.time ?? "",
    c.citizen ? `${c.citizen.firstName} ${c.citizen.lastName}` : "",
    c.assignedStaff
      ? `${c.assignedStaff.firstName} ${c.assignedStaff.lastName}`
      : "",
    c.checkedIn,
    c.flagged,
    c.notes ?? "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${csvType}_${new Date().toISOString().slice(0, 10)}.csv`;

  link.click();
  URL.revokeObjectURL(url);
}