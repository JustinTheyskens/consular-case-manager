import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
} from "@mui/material";
import { useGetCasesQuery } from "../../api/endpoints/CasesAPI.ts";

export default function StaffMetrics() {
  // Breaks down the query into parts
  const { data: cases, isLoading, isError, error } = useGetCasesQuery();

  // Loading and error cases
  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.log(error);
    return <div>Error loading cases</div>;
  }
  // Displays information in a table.
  return (
    <Box sx={{ width: "100%", px: 2 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Checked In</TableCell>
              <TableCell>Appointment Type</TableCell>
              <TableCell>Appointment Time</TableCell>
              <TableCell>Assigned Staff</TableCell>
              <TableCell>Citizen</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Flagged</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/** Doesn't render cells if cases is empty */}

            {cases?.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.reference}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  <Checkbox checked={c.checkedIn} disabled />
                </TableCell>
                <TableCell>{c.appointment?.type}</TableCell>
                <TableCell>
                  {new Date(c.appointment?.time).toLocaleString()}
                </TableCell>
                <TableCell>
                  {c.assignedStaff
                    ? `${c.assignedStaff.firstName} ${c.assignedStaff.lastName}`
                    : "Unassigned"}
                </TableCell>
                <TableCell>
                  {c.citizen
                    ? `${c.citizen.firstName} ${c.citizen.lastName}`
                    : "Unknown"}
                </TableCell>
                <TableCell>{c.notes || "-"}</TableCell>
                <TableCell>
                  <Checkbox checked={c.flagged} disabled />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
