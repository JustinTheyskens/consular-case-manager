import Grid from "@mui/material/Grid";
import {
    Box,
    ThemeProvider,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    Divider,
} from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { theme } from "../theme";
import { AppointmentCard } from "../components/AppointmentCard";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import AddCardIcon from "@mui/icons-material/AddCard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

// appointment types
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

// dummy appointment
const upcomingAppointment = {
    type: "Passport Renewal",
    date: "March 12, 2026",
    time: "10:30 AM",
    reference: "CCM-2026-48291",
    status: "Confirmed",
};



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
                        <Grid
                            container
                            spacing={3}
                            sx={{ mb: 4 }}
                        >
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

                        <Grid
                            container
                            spacing={3}
                        >
                            {/* Book an Appointment */}
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Card elevation={1}>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            gutterBottom
                                        >
                                            Book an Appointment
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                        >
                                            Select an appointment type to check availability and
                                            schedule.
                                        </Typography>
                                        <Grid
                                            container
                                            spacing={2}
                                        >
                                            {appointmentTypes.map((apt) => (
                                                <Grid
                                                    key={apt.label}
                                                    size={{ xs: 12, sm: 6 }}
                                                >
                                                    <AppointmentCard {...apt} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Upcoming Appointment + Manage */}
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Grid
                                    container
                                    spacing={3}
                                    direction="column"
                                >
                                    {/* Upcoming */}
                                    <Grid size={12}>
                                        <Card elevation={1}>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={600}
                                                    gutterBottom
                                                >
                                                    Upcoming Appointment
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Type
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                    >
                                                        {upcomingAppointment.type}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Date
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                    >
                                                        {upcomingAppointment.date}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Time
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                    >
                                                        {upcomingAppointment.time}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Reference
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={500}
                                                        sx={{ fontFamily: "monospace" }}
                                                    >
                                                        {upcomingAppointment.reference}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={upcomingAppointment.status}
                                                    color="success"
                                                    size="small"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Manage */}
                                    <Grid size={12}>
                                        <Card elevation={1}>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={600}
                                                    gutterBottom
                                                >
                                                    Manage Appointment
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 2 }}
                                                >
                                                    Use your reference number and email to modify or
                                                    cancel an existing appointment.
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        gap: 1,
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        fullWidth
                                                    >
                                                        Modify Appointment
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        fullWidth
                                                    >
                                                        Cancel Appointment
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};
