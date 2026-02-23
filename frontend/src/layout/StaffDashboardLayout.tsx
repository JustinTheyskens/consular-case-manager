import Grid from "@mui/material/Grid";
import { Box, ThemeProvider } from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { theme } from '../theme';

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export const StaffDashboard = () => {
    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Box minHeight="100vh">
                    <PageHeader
                        title="Consular Case Manager"
                        subtitle="Passport appointments and case tracking"
                    />

                    <Box sx={{ px: 3 }}>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Appointments Today"
                                    value={42}
                                    icon={<EventAvailableIcon />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Available Slots"
                                    value={18}
                                    icon={<AccessTimeIcon />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Pending Cases"
                                    value={24}
                                    icon={<AssignmentIcon />}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Flagged Cases"
                                    value={3}
                                    icon={<WarningAmberIcon />}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};
