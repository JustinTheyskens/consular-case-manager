import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  Button,
} from "@mui/material";
import {
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
import type { Case } from "../../../api/endpoints/CasesAPI.ts";
import MetricCard from "./MetricCard.tsx";
import { exportAsCSV } from "../../../components/ExportAsCSV.tsx";

interface Props {
  cases: Case[];
}

export default function StaffMetricsTimeChart({ cases }: Props) {
  let cTotal = 0;
  let cRenewal = 0;
  let cFirstTime = 0;
  let cEmergency = 0;
  let cLostOrStolen = 0;
  let cNoShowOrCancel = 0;

  const countsByDay: Record<string, number> = {};

  cases.forEach((c) => {
    const time = c.appointment?.time;
    if (!time) return;

    const dateKey = new Date(time).toISOString().split("T")[0];

    if (!countsByDay[dateKey]) {
      countsByDay[dateKey] = 0;
    }

    countsByDay[dateKey]++;
    cTotal++;

    switch (c.appointment?.type) {
      case "Renewal":
      case "passport-renewal":
        cRenewal++;
        break;
      case "First Time":
      case "passport-first":
        cFirstTime++;
        break;
      case "Emergency":
      case "passport-emergency":
        cEmergency++;
        break;
      case "Lost or Stolen":
      case "passport-lost":
      case "passport-stolen":
        cLostOrStolen++;
        break;
      case "No Show/Cancel":
      case "Cancelled":
        cNoShowOrCancel++;
        break;
    }
  });

  const chartData = Object.entries(countsByDay)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Cases History ({cTotal})</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {/* Chart */}
          <Grid size={8}>
            <Box sx={{ mt: 4, height: "60vh", width: "100%" }}>
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
          </Grid>

          {/* Metric Cards */}
          <Grid size={4}>
            <Box sx={{ px: 3 }}>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <MetricCard label="Total Renewals" value={cRenewal} />
                </Grid>

                <Grid size={6}>
                  <MetricCard label="Total First Time" value={cFirstTime} />
                </Grid>

                <Grid size={6}>
                  <MetricCard label="Total Emergencies" value={cEmergency} />
                </Grid>

                <Grid size={6}>
                  <MetricCard
                    label="Total Lost or Stolen"
                    value={cLostOrStolen}
                  />
                </Grid>

                <Grid size={6}>
                  <MetricCard
                    label="Total No Show or Cancel"
                    value={cNoShowOrCancel}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={() => exportAsCSV(cases, "case_history")}
                >
                  Export CSV
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
