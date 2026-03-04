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
    IconButton,
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

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState } from "react";
import { StatusEditor } from "../components/StatusEditor";
import { Link } from "react-router-dom";

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
const typeOptions = [
  "All",
  "Renewal",
  "First-Time",
  "Emergency",
  "Lost or Stolen",
];

const statusColors: Record<
  string,
  "default" | "warning" | "info" | "success" | "error"
> = {
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

/* Hard coded data */
const dummyData = [
  {
    id: 1,
    reference: "CCM-2026-48291",
    applicant: "Maria Santos",
    type: "Renewal",
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
    type: "First-Time",
    date: "Feb 23, 2026",
    time: "10:30 AM",
    status: "In Review",
    flagged: true,
    notes: "Missing birth certificate copy",
  },
  {
    id: 3,
    reference: "CCM-2026-48317",
    applicant: "Aisha Kamara",
    type: "Emergency",
    date: "Feb 23, 2026",
    time: "11:00 AM",
    status: "Scheduled",
    flagged: false,
    notes: "",
  },
  {
    id: 4,
    reference: "CCM-2026-48330",
    applicant: "David Chen",
    type: "Lost or Stolen",
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
    type: "Renewal",
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
    type: "First-Time",
    date: "Feb 23, 2026",
    time: "3:00 PM",
    status: "In Review",
    flagged: true,
    notes: "Requires supervisor sign-off",
  },
];

/* Main Dashboard */
export const StaffDashboard = () => {
  const [appointments, setAppointments] = useState(dummyData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [activeStatusEditId, setActiveStatusEditId] = useState<number | null>(
    null,
  );

  const filtered = appointments.filter((a) => {
    const matchedSearch =
      a.reference.toLowerCase().includes(search.toLocaleLowerCase()) ||
      a.applicant.toLocaleLowerCase().includes(search.toLocaleLowerCase());

    const matchedStatus = statusFilter == "All" || a.status == statusFilter;
    const matchedType = typeFilter == "All" || a.type == typeFilter;

    return matchedSearch && matchedStatus && matchedType;
  });

  const flaggedCount = appointments.filter((a) => a.flagged).length;
  const reviewCount = appointments.filter(
    (a) => a.status == "In Review",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status == "Completed",
  ).length;

  const toggleFlag = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id == id ? { ...a, flagged: !a.flagged } : a)),
    );
  };

  const updateNote = (id: number, note: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id == id ? { ...a, notes: note } : a)),
    );
  };

  const updateStatus = (id: number, status: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id == id ? { ...a, status } : a)),
    );
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
            <Grid container spacing={3} sx={{ mb: 4 }}>
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
            <Card elevation={1} sx={{ mb: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <FilterListIcon color="action" />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Search & Filter
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} alignItems="center">
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
                    <FormControl fullWidth size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        {statusOptions.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={typeFilter}
                        label="Type"
                        onChange={(e) => setTypeFilter(e.target.value)}
                      >
                        {typeOptions.map((t) => (
                          <MenuItem key={t} value={t}>
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
                  <Typography variant="subtitle1" fontWeight={600}>
                    Today's Schedule
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filtered.length} of {appointments.length} appointments
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
                      {filtered.map((apt) => (
                        <>
                          <TableRow
                            key={apt.id}
                            sx={{
                              backgroundColor: apt.flagged
                                ? "rgba(255, 152, 0, 0.06)"
                                : "inherit",
                              "&:hover": {
                                backgroundColor: "action.hover",
                              },
                            }}
                          >
                            <TableCell>{apt.time}</TableCell>
                            <TableCell>{apt.reference}</TableCell>
                            <TableCell>{apt.applicant}</TableCell>
                            <TableCell>{apt.type}</TableCell>
                            {/* If actively editing, 
                                                        dropdown menu, 
                                                        else, 
                                                        chip */}
                            <TableCell>
                              {activeStatusEditId == apt.id ? (
                                <StatusEditor
                                  current={apt.status}
                                  onSave={(s) => updateStatus(apt.id, s)}
                                  onClose={() => setActiveStatusEditId(null)}
                                />
                              ) : (
                                <Chip
                                  label={apt.status}
                                  color={statusColors[apt.status] ?? "default"}
                                  size="small"
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color={
                                  apt.notes ? "text.primary" : "text.disabled"
                                }
                                sx={{
                                  fontStyle: apt.notes ? "normal" : "italic",
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
                                    onClick={() => toggleFlag(apt.id)}
                                    color={apt.flagged ? "warning" : "default"}
                                  >
                                    <Badge
                                      color="warning"
                                      variant="dot"
                                      invisible={!apt.flagged}
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
                                        activeNoteId == apt.id ? null : apt.id,
                                      )
                                    }
                                    color={
                                      activeNoteId == apt.id
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
                                        activeStatusEditId == apt.id
                                          ? null
                                          : apt.id,
                                      )
                                    }
                                    color={
                                      activeStatusEditId == apt.id
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
                          {activeNoteId == apt.id && (
                            <TableRow key={`note-${apt.id}`}>
                              <TableCell colSpan={7} sx={{ py: 0, px: 2 }}>
                                <NoteModal
                                  reference={apt.reference}
                                  existingNotes={apt.notes}
                                  onSave={(note) => updateNote(apt.id, note)}
                                  onClose={() => setActiveNoteId(null)}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
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
