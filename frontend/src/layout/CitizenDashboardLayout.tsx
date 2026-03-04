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

import { useGetAppointmentTypesQuery } from "../api/endpoints/AppointmentsAPI";
import { useGetUpcomingAppointmentQuery } from "../api/endpoints/AppointmentsAPI";
import { useModifyAppointmentMutation } from "../api/endpoints/AppointmentsAPI";
import { useCancelAppointmentMutation } from "../api/endpoints/AppointmentsAPI";

import { useSelector } from "react-redux";
import type { RootState } from "../store/Store";
import type { SessionState } from "../store/SessionSlice";
import { useGetCasesByCitizenQuery } from "../api/endpoints/CasesAPI";

// appointment types
const appointmentTypes = [
    {
        label: "Passport Renewal",
        icon: <AutorenewIcon sx={{ fontSize: 36 }} />,
        description: "Renew an existing passport",
        color: "#1976d2", // Blue
    },
    {
        label: "First-Time Passport",
        icon: <AddCardIcon sx={{ fontSize: 36 }} />,
        description: "Apply for your first passport",
        color: "#2e7d32", // Green
    },
    {
        label: "Emergency Travel Document",
        icon: <FlightTakeoffIcon sx={{ fontSize: 36 }} />,
        description: "Urgent travel within 72 hours",
        color: "#ed6c02", // Orange
    },
    {
        label: "Lost or Stolen Passport",
        icon: <ReportProblemIcon sx={{ fontSize: 36 }} />,
        description: "Report and replace a lost passport",
        color: "#d32f2f", // Red
    },
];

export const UserDashboard = () => {
    // get user id from session slice
    const userId = useSelector((state: { session: SessionState }) => state.session.userId);
    const name = useSelector((state: { session: SessionState }) => state.session.name ?? "guest");

    // API hooks
    // const {data: appointmentTypes, isLoading: typesLoading } =
    //     useGetAppointmentTypesQuery();

    const { data: cases, isLoading: casesLoading } = useGetCasesByCitizenQuery(userId!, {
        skip: !userId,
    });

    const upcomingAppointment = cases?.find((c) => c.status === "scheduled");
    const upcoming = cases?.filter((c) => c.status === "scheduled").length ?? 0;
    const completed = cases?.filter((c) => c.status === "completed").length ?? 0;
    const pending = cases?.filter((c) => c.status === "in-review").length ?? 0;

    const [modifyAppointment] = useModifyAppointmentMutation();
    const [cancelAppointment] = useCancelAppointmentMutation();

    const handleModify = async () => {
        if (!upcomingAppointment?._id) return;
        await modifyAppointment({
            id: upcomingAppointment._id,
            changes: { date: "2026-03-20", time: "2:00 PM" },
        });
    };

    const handleCanel = async () => {
        if (!upcomingAppointment?._id) return;
        await cancelAppointment(upcomingAppointment._id);
    };

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
                            justifyContent="right"
                            sx={{ mb: 8 }}
                        >
                            <Grid pl={10} pt={2} size={{ xs: 12, sm: 6, md: 3 }}>
                                {/* Greeting */}
                                <Typography
                                    variant="h5"
                                    fontWeight={600}
                                    sx={{ color: "text.primary" }}
                                >
                                    Welcome, {name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.5 }}
                                >
                                    User Dashboard
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>

                                <MetricCard
                                    label="Upcoming Appointments"
                                    value={upcoming}
                                    icon={<CalendarMonthIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Completed"
                                    value={completed}
                                    icon={<BookmarkAddedIcon />}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <MetricCard
                                    label="Pending Review"
                                    value={pending}
                                    icon={<PendingActionsIcon />}
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
                                        <Card
                                            elevation={1}
                                            sx={{ border: "2px solid lightgray" }}
                                        >
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
                                                        {casesLoading ? ( // appointments loading...
                                                            <Typography variant="body2">
                                                                Loading...
                                                            </Typography>
                                                        ) : upcomingAppointment ? ( // appointments go here
                                                            <Box>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent:
                                                                            "space-between",
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
                                                                        {new Date(
                                                                            upcomingAppointment
                                                                                .appointment.time,
                                                                        ).toLocaleDateString()}
                                                                    </Typography>
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent:
                                                                            "space-between",
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
                                                                        {new Date(
                                                                            upcomingAppointment
                                                                                .appointment.time,
                                                                        ).toLocaleDateString()}
                                                                    </Typography>
                                                                </Box>
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        justifyContent:
                                                                            "space-between",
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
                                                                        sx={{
                                                                            fontFamily: "monospace",
                                                                        }}
                                                                    >
                                                                        {
                                                                            upcomingAppointment.reference
                                                                        }
                                                                    </Typography>
                                                                </Box>
                                                                <Chip
                                                                    label={
                                                                        upcomingAppointment.status
                                                                    }
                                                                    color="success"
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        ) : (
                                                            // no appointments
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                No upcoming appointments.
                                                            </Typography>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Manage */}
                                    <Grid size={12}>
                                        <Card
                                            elevation={1}
                                            sx={{ border: "2px solid lightgray" }}
                                        >
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
                                                        onClick={handleModify}
                                                        disabled={!upcomingAppointment}
                                                    >
                                                        Modify Appointment
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        fullWidth
                                                        onClick={handleCanel}
                                                        disabled={!upcomingAppointment}
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
