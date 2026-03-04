/* Requirement
 Appointment Volume by Date shows a simple bar chart of how many appointments were booked per day over a selectable date range,
 defaulting to the last 30 days. 
 This gives staff a quick sense of demand trends without any complex processing.
*/

/* Additional Count Requirements:
       Appointment Type Distribution shows a breakdown of how many appointments fall into each type 
       (Renewal, First-Time, Emergency, Lost or Stolen) within the selected date range. 
       This helps staff understand which services are driving the most demand.

        No-Show & Cancellation Count shows a simple numeric summary of how many appointments were 
        cancelled or flagged as no-shows within the selected period. 
        This reuses whatever cancellation data the existing system already tracks.
*/

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import {
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import type { Case } from "../../../api/endpoints/CasesAPI.ts";
import {
  lastNumDays,
  createRangeOptions,
} from "../../../components/StaffMetricsTimeChartHelper.tsx";
import { MetricCard } from "../../../components/MetricCard.tsx";

interface Props {
  cases: Case[];
  selectedOption: {
    start: number;
  };
}

export default function StaffMetricsTimeChart({
  cases,
  selectedOption,
}: Props) {
  // Sorts case by newest to oldest
  let sortedCases = [...(cases ?? [])].sort((a, b) => {
    const timeA = new Date(a.appointment?.time ?? 0).getTime();
    const timeB = new Date(b.appointment?.time ?? 0).getTime();
    return timeB - timeA; // ascending
  });

  // Decides how many days to create the array for

  // Adds a counter for the number of cases on each days
  function addCountDays(num: number) {
    let lastNDays = lastNumDays(num);

    let cTotal = 0;
    let cRenewal = 0;
    let cFirstTime = 0;
    let cEmergency = 0;
    let cLostOrStolen = 0;
    let cNoShowOrCancel = 0;
    let cSched = 0;

    sortedCases.forEach((c) => {
      if (!c.appointment?.time) return;

      const dateKey = new Date(c.appointment.time).toISOString().split("T")[0];
      // Valid day, add it to the dates and also increment counts
      if (lastNDays[dateKey] !== undefined) {
        lastNDays[dateKey]++;
        cTotal++;
        switch (c.status) {
          case "Renewal":
            cRenewal++;
            break;
          case "First Time":
            cFirstTime++;
            break;
          case "Emergency":
            cEmergency++;
            break;
          case "Lost or Stolen":
            cLostOrStolen++;
            break;
          case "No Show/Cancel":
            cNoShowOrCancel++;
            break;
          case "scheduled":
            cSched++;
            break;
        }
      }
    });
    return {
      lastNDays,
      cTotal,
      cRenewal,
      cFirstTime,
      cEmergency,
      cLostOrStolen,
      cNoShowOrCancel,
      cSched,
    };
  }

  // calculate chartDays only if selectedOption exists, also sets the counts.
  const {
    lastNDays,
    cTotal,
    cRenewal,
    cFirstTime,
    cEmergency,
    cLostOrStolen,
    cNoShowOrCancel,
    cSched,
  } = selectedOption ? addCountDays(selectedOption.start) : addCountDays(30); // fallback to last 30 days

  // sorts it from earliest -> latest always
  const chartData = Object.entries(lastNDays)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Cases History</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mt: 4, height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Line type="monotone" dataKey="count" dot={false} />
                <Scatter dataKey="count" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>

          {/** Counts */}

          <Box sx={{ px: 3 }}>
            {/* ── Metric Cards ─from Staff Dashboard */}
            <Grid container spacing={3} sx={{ mb: 1 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard label="Total Count" value={cTotal} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard label="Total Renewals" value={cRenewal} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard label="Total First Time" value={cFirstTime} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard label="Total Emergencies" value={cEmergency} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                  label="Total Lost or Stolen"
                  value={cLostOrStolen}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                  label="Total No Show or Cancel"
                  value={cNoShowOrCancel}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard label="Scheduled" value={cSched} />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
