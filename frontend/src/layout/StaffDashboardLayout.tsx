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
    CardActionArea,
    IconButton,
    Icon,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Tooltip,
    Badge,
} from "@mui/material";
import { PageHeader } from "../components/PageHeader";
import { MetricCard } from "../components/MetricCard";
import { theme } from "../theme";
import SaveIcon from "@mui/icons-material/Save";
import FlagIcon from "@mui/icons-material/Flag";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Fragment, useState } from "react";
import { StatusEditor } from "../components/StatusEditor";
import { Link } from "react-router-dom";
import { useGetCasesQuery, useUpdateCaseMutation } from "../api/endpoints/CasesAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../store/Store";

// Scheduled, In Review, Approved, Rejected, and Completed
const statusOptions = [
    "All",
    "Scheduled",
    "In Review",
    "Approved",
    "Rejected",
    "Completed",
    "Cancelled",
];
const typeOptions = ["All", "Renewal", "First-Time", "Emergency", "Lost or Stolen"];

const statusColors: Record<string, "default" | "warning" | "info" | "success" | "error"> = {
    Approved: "success",
    "In Review": "info",
    Rejected: "warning",
    Completed: "default",
    Cancelled: "error",
};

/* Notepad */
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
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                        onSave(notes);
                        onClose();
                    }}
                >
                    <SaveIcon />
                </IconButton>
            </CardContent>
        </Card>
    );
};

/* Main Dashboard */
export const StaffDashboard = () => {
    const { userId, emailAddress } = useSelector((state: RootState) => state.session);
    const { data: cases = [], isLoading } = useGetCasesQuery({ staff: userId! });
    const [updateCase] = useUpdateCaseMutation();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
    const [activeStatusEditId, setActiveStatusEditId] = useState<number | null>(null);

    const filtered = cases.filter((_case) => {
        const matchedSearch =
            _case.reference.toString().includes(search.toLocaleLowerCase()) ||
            _case.citizen.firstName.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            _case.citizen.lastName.toLocaleLowerCase().includes(search.toLocaleLowerCase());

        const matchedStatus = statusFilter == "All" || _case.status == statusFilter;
        const matchedType = typeFilter == "All" || _case.appointment.type == typeFilter;

        return matchedSearch && matchedStatus && matchedType;
    });

    if (isLoading) {
        return <Typography>Loading Cases...</Typography>;
    }

    const flaggedCount = cases.filter((_case) => _case.flagged).length;
    const reviewCount = cases.filter((_case) => _case.status == "In Review").length;
    const completedCount = cases.filter((_case) => _case.status == "Completed").length;

    //TODO: Rework these, I'm moving away from `appointments` as state.
    const toggleFlag = async (ref: number) => {
        // setAppointments((prev) =>
        //     prev.map((a) => (a.id == id ? { ...a, flagged: !a.flagged } : a)),
        // );
        const relatedCase = cases.find((c) => c.reference == ref);
        if (!relatedCase) return;

        console.log("Updating case:");
        console.log(relatedCase);

        const { flagged, ...rest } = relatedCase;
        await updateCase({ ...rest, flagged: !flagged }).unwrap();
    };

    const updateNote = async (ref: number, note: string) => {
        // setAppointments((prev) => prev.map((a) => (a.id == id ? { ...a, notes: note } : a)));
        const relatedCase = cases.find((c) => c.reference == ref);
        if (!relatedCase) return;

        console.log("Updating case:");
        console.log(relatedCase);
        const { notes, ...rest } = relatedCase;
        await updateCase({ ...rest, notes: note }).unwrap();
    };

    const updateStatus = async (ref: number, newStatus: string) => {
        // setAppointments((prev) => prev.map((a) => (a.id == id ? { ...a, status } : a)));
        const relatedCase = cases.find((c) => c.reference == ref);
        if (!relatedCase) return;

        console.log("Updating case:");
        console.log(relatedCase);
        const { status, ...rest } = relatedCase;
        await updateCase({ ...rest, status: newStatus }).unwrap();
    };

    return (
        <Box>
            <ThemeProvider theme={theme}>
                <Box minHeight="100vh">
                    <PageHeader
                        title="Consular Case Manager"
                        subtitle="Passport appointments and case tracking"
                    >
                        {/** Directs to System Analytics  */}
                        <Button
                            component={Link}
                            to="/staff/dashboard/metrics"
                            variant="outlined"
                            sx={{
                                borderColor: "primary.contrastText",
                                color: "primary.contrastText",
                            }}
                        >
                            View System Analytics
                        </Button>
                    </PageHeader>

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
                        {/* Appointment Table */}
                        <Card>
                            {/* Header */}
                            <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        Today's Schedule
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {filtered.length} of {cases.length} appointments
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <strong>Time</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <strong>Reference</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <strong>Applicant</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <strong>Type</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <strong>Status</strong>
                                                </TableCell>
                                                <TableCell>
                                                    <strong>Notes</strong>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <strong>Actions</strong>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filtered.map((apt) => {
                                                return (
                                                    <Fragment key={apt.reference}>
                                                        <TableRow
                                                            sx={{
                                                                backgroundColor: apt.flagged
                                                                    ? "rgba(255, 152, 0, 0.06)"
                                                                    : "inherit",
                                                                "&:hover": {
                                                                    backgroundColor: "action.hover",
                                                                },
                                                            }}
                                                        >
                                                            <TableCell>
                                                                {apt.appointment.time}
                                                            </TableCell>
                                                            <TableCell>{apt.reference}</TableCell>
                                                            <TableCell>
                                                                {apt.citizen.firstName +
                                                                    " " +
                                                                    apt.citizen.lastName}
                                                            </TableCell>
                                                            <TableCell>
                                                                {apt.appointment.type}
                                                            </TableCell>
                                                            {/* If actively editing, 
                                                        dropdown menu, 
                                                        else, 
                                                        chip */}
                                                            <TableCell>
                                                                {activeStatusEditId ==
                                                                apt.reference ? (
                                                                    <StatusEditor
                                                                        current={apt.status}
                                                                        onSave={(s) =>
                                                                            updateStatus(
                                                                                apt.reference,
                                                                                s,
                                                                            )
                                                                        }
                                                                        onClose={() =>
                                                                            setActiveStatusEditId(
                                                                                null,
                                                                            )
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Chip
                                                                        label={apt.status}
                                                                        color={
                                                                            statusColors[
                                                                                apt.status
                                                                            ] ?? "default"
                                                                        }
                                                                        size="small"
                                                                    />
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography
                                                                    variant="body2"
                                                                    color={
                                                                        apt.notes
                                                                            ? "text.primary"
                                                                            : "text.disabled"
                                                                    }
                                                                    sx={{
                                                                        fontStyle: apt.notes
                                                                            ? "normal"
                                                                            : "italic",
                                                                        maxWidth: 160,
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    {apt.notes || "no notes"}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box
                                                                    sx={{
                                                                        display: "flex",
                                                                        gap: 0.5,
                                                                        justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <Tooltip
                                                                        title={
                                                                            apt.flagged
                                                                                ? "Remove Flag"
                                                                                : "FLag or Follow Up"
                                                                        }
                                                                    >
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                toggleFlag(
                                                                                    apt.reference,
                                                                                )
                                                                            }
                                                                            color={
                                                                                apt.flagged
                                                                                    ? "warning"
                                                                                    : "default"
                                                                            }
                                                                        >
                                                                            <Badge
                                                                                color="warning"
                                                                                variant="dot"
                                                                                invisible={
                                                                                    !apt.flagged
                                                                                }
                                                                            >
                                                                                <FlagIcon fontSize="small" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Add / Edit Note">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                setActiveNoteId(
                                                                                    activeNoteId ==
                                                                                        apt.reference
                                                                                        ? null
                                                                                        : apt.reference,
                                                                                )
                                                                            }
                                                                            color={
                                                                                activeNoteId ==
                                                                                apt.reference
                                                                                    ? "primary"
                                                                                    : "default"
                                                                            }
                                                                        >
                                                                            <NoteAddIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Update Status">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() =>
                                                                                setActiveStatusEditId(
                                                                                    activeStatusEditId ==
                                                                                        apt.reference
                                                                                        ? null
                                                                                        : apt.reference,
                                                                                )
                                                                            }
                                                                            color={
                                                                                activeStatusEditId ==
                                                                                apt.reference
                                                                                    ? "primary"
                                                                                    : "default"
                                                                            }
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                        {activeNoteId == apt.reference && (
                                                            <TableRow key={`note-${apt.reference}`}>
                                                                <TableCell
                                                                    colSpan={7}
                                                                    sx={{ py: 0, px: 2 }}
                                                                >
                                                                    <NoteModal
                                                                        reference={apt.reference.toString()}
                                                                        existingNotes={
                                                                            apt.notes
                                                                                ? apt.notes
                                                                                : ""
                                                                        }
                                                                        onSave={(note) =>
                                                                            updateNote(
                                                                                apt.reference,
                                                                                note,
                                                                            )
                                                                        }
                                                                        onClose={() =>
                                                                            setActiveNoteId(null)
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};
