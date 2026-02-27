import Grid from "@mui/material/Grid";
import {
    Box,
    ThemeProvider,
    Card,
    CardContent,
    InputLabel,
    Typography,
    Divider,
    TextField,
    MenuItem,
    Select,
    FormControl,
    Button,
} from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { theme } from "../theme";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";

// Scheduled, In Review, Approved, Rejected, and Completed
const statusOptions = ["All", "In Review", "Approved", "Rejected", "Completed", "Cancelled"];
const typeOptions = ["All", "Renewal", "First-Time", "Emergency", "Lost or Stolen"];

const NoteModal = ({
    reference,
    existingNotes,
    onSave,
    onClose,
}: {
    reference: string;
    existingNotes: string;
    onSave: (note: string) => void;
    onClose: () => void;
}) => {
    const [notes, setNotes] = useState(existingNotes);
    return (
        <Card
            elevation={3}
            sx={{ mt: 1, mb: 1, border: "1px solid", borderColor: "primary.main" }}
        >
            <CardContent>
                <TextField
                    multiline
                    rows={3}
                    fullWidth
                    placeholder="Add note..."
                    value={notes}
                    onChange={(n) => setNotes(n.target.value)}
                    sx={{ mb: 2 }}
                />
            </CardContent>
        </Card>
    );
};

const dummyData = [
    {
        id: 1,
        reference: "CCM-2026-48291",
        applicant: "Maria Santos",
        type: "Passport Renewal",
        date: "Feb 23, 2026",
        time: "9:00 AM",
        status: "Confirmed",
        flagged: false,
        notes: "",
    },
    {
        id: 2,
        reference: "CCM-2026-48302",
        applicant: "James O'Brien",
        type: "First-Time Passport",
        date: "Feb 23, 2026",
        time: "10:30 AM",
        status: "Pending Review",
        flagged: true,
        notes: "Missing birth certificate copy",
    },
    {
        id: 3,
        reference: "CCM-2026-48317",
        applicant: "Aisha Kamara",
        type: "Emergency Travel Document",
        date: "Feb 23, 2026",
        time: "11:00 AM",
        status: "In Progress",
        flagged: false,
        notes: "",
    },
    {
        id: 4,
        reference: "CCM-2026-48330",
        applicant: "David Chen",
        type: "Lost or Stolen Passport",
        date: "Feb 23, 2026",
        time: "1:00 PM",
        status: "Confirmed",
        flagged: false,
        notes: "",
    },
    {
        id: 5,
        reference: "CCM-2026-48345",
        applicant: "Fatima Al-Hassan",
        type: "Passport Renewal",
        date: "Feb 23, 2026",
        time: "2:30 PM",
        status: "Completed",
        flagged: false,
        notes: "Processed successfully",
    },
    {
        id: 6,
        reference: "CCM-2026-48360",
        applicant: "Tom Gallagher",
        type: "First-Time Passport",
        date: "Feb 23, 2026",
        time: "3:00 PM",
        status: "Pending Review",
        flagged: true,
        notes: "Requires supervisor sign-off",
    },
];

export const StaffDashboard = () => {
    const [appointments, setAppointments] = useState();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Box minHeight="100vh">
                    <PageHeader
                        title="Consular Case Manager"
                        subtitle="Passport appointments and case tracking"
                    />

                    <Box sx={{ px: 3 }}>
                        {/* ── Metric Cards ── */}
                        <Grid
                            container
                            spacing={3}
                            sx={{ mb: 4 }}
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

                        {/* Search & Filters */}
                        <Card
                            elevation={1}
                            sx={{ mb: 3 }}
                        >
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                                    <FilterListIcon color="action" />
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        Search & Filter
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                >
                                    <Grid size={{ xs: 12, sm: 5 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Search by reference or applicant name..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <SearchIcon
                                                        fontSize="small"
                                                        sx={{ mr: 1, color: "text.secondary" }}
                                                    />
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3 }}>
                                        <FormControl
                                            fullWidth
                                            size="small"
                                        >
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={statusFilter}
                                                label="Status"
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                {statusOptions.map((s) => (
                                                    <MenuItem
                                                        key={s}
                                                        value={s}
                                                    >
                                                        {s}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 3 }}>
                                        <FormControl
                                            fullWidth
                                            size="small"
                                        >
                                            <InputLabel>Type</InputLabel>
                                            <Select
                                                value={typeFilter}
                                                label="Type"
                                                onChange={(e) => setTypeFilter(e.target.value)}
                                            >
                                                {typeOptions.map((t) => (
                                                    <MenuItem
                                                        key={t}
                                                        value={t}
                                                    >
                                                        {t}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => {
                                                setSearch("");
                                                setStatusFilter("All");
                                                setTypeFilter("All");
                                            }}
                                        >
                                            Clear
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <NoteModal
                            reference=""
                            existingNotes=""
                            onSave={() => {}}
                            onClose={() => {}}
                        />
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};
