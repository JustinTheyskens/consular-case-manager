import Grid from "@mui/material/Grid";
import { Box, ThemeProvider, Card, CardContent, Typography, Button, Chip, Divider } from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { theme } from "../theme";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddCardIcon from "@mui/icons-material/AddCard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

// Appointment type options
const appointmentTypes = [
    {
        label: "Passport Renewal",
        icon: <AutorenewIcon sx={{ fontSize: 36 }} />,
        description: "Renew an existing passport",
        color: "#1976d2",
    },
    {
        label: "First-Time Passport",
        icon: <AddCardIcon sx={{ fontSize: 36 }} />,
        description: "Apply for your first passport",
        color: "#2e7d32",
    },
    {
        label: "Emergency Travel Document",
        icon: <FlightTakeoffIcon sx={{ fontSize: 36 }} />,
        description: "Urgent travel within 72 hours",
        color: "#ed6c02",
    },
    {
        label: "Lost or Stolen Passport",
        icon: <ReportProblemIcon sx={{ fontSize: 36 }} />,
        description: "Report and replace a lost passport",
        color: "#d32f2f",
    },
];

// Placeholder upcoming appointment
const upcomingAppointment = {
    type: "Passport Renewal",
    date: "March 12, 2026",
    time: "10:30 AM",
    reference: "CCM-2026-48291",
    status: "Confirmed",
};

const AppointmentTypeCard = ({
    label,
    icon,
    description,
    color,
}: {
    label: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}) => (
    <Card
        elevation={1}
        sx={{
            height: "100%",
            cursor: "pointer",
            border: "2px solid transparent",
            transition: "all 0.2s ease",
            "&:hover": {
                borderColor: color,
                boxShadow: `0 4px 20px ${color}33`,
                transform: "scale(1.02)",
            },
        }}
    >
        <CardContent
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 1,
                py: 3,
            }}
        >
            <Box sx={{ color }}>{icon}</Box>
            <Typography variant="subtitle1" fontWeight={600}>
                {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {description}
            </Typography>
        </CardContent>
    </Card>
);

export const UserDashboard = () => {
    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Box minHeight="100vh">
                    <PageHeader
                        title="Consular Case Manager"
                        subtitle="Passport appointments and case tracking"
                    />

                    <Box sx={{ px: 3, pb: 4 }}>
                        {/* Summary Metrics */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Upcoming Appointments"
                                    value={1}
                                    icon={<CalendarMonthIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Completed"
                                    value={3}
                                    icon={<BookmarkAddedIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Pending Review"
                                    value={1}
                                    icon={<PendingActionsIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Modifications Made"
                                    value={2}
                                    icon={<EditCalendarIcon />}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};
