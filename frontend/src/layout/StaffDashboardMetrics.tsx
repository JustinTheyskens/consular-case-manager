import { PageHeader } from "../components/PageHeader.tsx";
import { theme } from "../theme";
import { Box, Button, ThemeProvider } from "@mui/material";
import StaffMetrics from "../pages/staff/StaffMetrics/StaffMetrics.tsx";
import { Link } from "react-router-dom";

export default function StaffDashboardMetrics() {
  return (
    <>
      {/** Uses the same theme as previous page*/}
      <ThemeProvider theme={theme}>
        <PageHeader title="System Analytics">
          {/** Directs back to Dashboard page  */}
          <Button
            component={Link}
            to="/staff/dashboard"
            variant="outlined"
            sx={{
              borderColor: "primary.contrastText",
              color: "primary.contrastText",
            }}
          >
            Staff Dashboard
          </Button>
        </PageHeader>
      </ThemeProvider>
      {/** Tries to display staff Metrics, shows error loading if failed.  */}
      <StaffMetrics />
    </>
  );
}
