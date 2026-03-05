import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    IconButton,
    Snackbar,
    Stack,
    Switch,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { theme } from "../../theme.ts";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import {
    useGetAvailabilitiesQuery,
    useCreateAvailabilityMutation,
    useUpdateAvailabilityMutation,
    useDeleteAvailabilityMutation,
} from "../../api/endpoints/AvailabilityAPI.ts";

export interface DayAvailability {
    enabled: boolean;
    startTime: number; // minutes after midnight
    endTime: number; // minutes after midnight
    dayOfWeek: number; // 0 (Sun) – 6 (Sat)
    capacity: number;
}

interface AvailabilityModalProps {
    open: boolean;
    onClose: () => void;
    staffId: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DAY_INDEX: Record<string, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

const ALL_APPOINTMENT_TYPES = [
    "passport-renewal",
    "passport-first",
    "passport-emergency",
    "passport-lost",
] as const;

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
};

const DEFAULT_WEEKLY_HOURS: Record<string, DayAvailability> = {
    Monday: { enabled: true, startTime: 540, endTime: 1020, dayOfWeek: 1, capacity: 1 },
    Tuesday: { enabled: true, startTime: 540, endTime: 1020, dayOfWeek: 2, capacity: 1 },
    Wednesday: { enabled: true, startTime: 540, endTime: 1020, dayOfWeek: 3, capacity: 1 },
    Thursday: { enabled: true, startTime: 540, endTime: 1020, dayOfWeek: 4, capacity: 1 },
    Friday: { enabled: true, startTime: 540, endTime: 900, dayOfWeek: 5, capacity: 1 },
    Saturday: { enabled: false, startTime: 600, endTime: 840, dayOfWeek: 6, capacity: 1 },
    Sunday: { enabled: false, startTime: 600, endTime: 840, dayOfWeek: 0, capacity: 1 },
};

export const AvailabilityModal = ({ open, onClose, staffId }: AvailabilityModalProps) => {
    const [activeTab, setActiveTab] = useState<"hours" | "summary">("hours");
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [weeklyHours, setWeeklyHours] =
        useState<Record<string, DayAvailability>>(DEFAULT_WEEKLY_HOURS);
    const [allowedAppointments, setAllowedAppointments] = useState<string[]>([
        ...ALL_APPOINTMENT_TYPES,
    ]);

    const { data: existingAvailabilities = [] } = useGetAvailabilitiesQuery();
    const [createAvailability] = useCreateAvailabilityMutation();
    const [updateAvailability] = useUpdateAvailabilityMutation();
    const [deleteAvailability] = useDeleteAvailabilityMutation();

    const handleSave = async () => {
        if (allowedAppointments.length === 0) {
            setError("Please select at least one appointment type.");
            return;
        }
        setSaving(true);
        setError(null);
        try {
            // Filter to this staff member's records and group by dayOfWeek
            const groupedByDay = new Map<number, (typeof existingAvailabilities)[0][]>();
            existingAvailabilities
                .filter((doc) => doc.staff === staffId)
                .forEach((doc) => {
                    const group = groupedByDay.get(doc.dayOfWeek) ?? [];
                    group.push(doc);
                    groupedByDay.set(doc.dayOfWeek, group);
                });

            // Delete any duplicate records per day, keeping the most recent
            for (const docs of groupedByDay.values()) {
                if (docs.length > 1) {
                    const [, ...duplicates] = [...docs].reverse();
                    await Promise.all(duplicates.map((doc) => deleteAvailability(doc._id)));
                }
            }

            // Build a clean single-record-per-day map
            const existingByDay = new Map<number, (typeof existingAvailabilities)[0]>();
            groupedByDay.forEach((docs, dayOfWeek) => {
                existingByDay.set(dayOfWeek, [...docs].reverse()[0]);
            });

            // PUT, POST, or DELETE each day based on enabled state
            const requests = Object.entries(weeklyHours).map(([day, avail]) => {
                const { enabled, startTime, endTime, capacity } = avail;
                const dayOfWeek = DAY_INDEX[day];
                const existing = existingByDay.get(dayOfWeek);

                if (enabled) {
                    const payload = {
                        startTime,
                        endTime,
                        dayOfWeek,
                        staff: staffId,
                        capacity,
                        allowedAppointments: allowedAppointments as unknown as string[],
                    };
                    if (existing) {
                        return updateAvailability({ reference: existing._id, ...payload });
                    } else {
                        return createAvailability(payload);
                    }
                } else if (existing) {
                    return deleteAvailability(existing._id);
                }
                return Promise.resolve();
            });

            await Promise.all(requests);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
            onClose();
        } catch {
            setError("Failed to save availability. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const updateDay = (day: string, patch: Partial<DayAvailability>) =>
        setWeeklyHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));

    const toggleAppointmentType = (type: string) =>
        setAllowedAppointments((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
        );

    const tabs = [
        {
            key: "hours" as const,
            label: "Weekly Hours",
            icon: <AccessAlarmIcon fontSize="small" />,
        },
        { key: "summary" as const, label: "Summary", icon: <CalendarMonthIcon fontSize="small" /> },
    ];

    return (
        <>
            <ThemeProvider theme={theme}>
                <Dialog
                    open={open}
                    onClose={onClose}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            px: 3,
                            py: 2.5,
                            backgroundColor: "primary.main",
                            color: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar
                                sx={{ bgcolor: "rgba(255,255,255,0.15)", width: 38, height: 38 }}
                            >
                                <CalendarMonthIcon fontSize="small" />
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    letterSpacing={0.3}
                                >
                                    Manage Availability
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{ opacity: 0.8 }}
                                >
                                    Set your working hours
                                </Typography>
                            </Box>
                        </Box>
                        <IconButton
                            onClick={onClose}
                            size="small"
                            sx={{ color: "white" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Tab Nav */}
                    <Box
                        sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            px: 2,
                            pt: 1,
                            backgroundColor: "background.paper",
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={0}
                        >
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.key}
                                    size="small"
                                    startIcon={tab.icon}
                                    onClick={() => setActiveTab(tab.key)}
                                    sx={{
                                        fontSize: "0.75rem",
                                        fontWeight: activeTab === tab.key ? 700 : 400,
                                        color:
                                            activeTab === tab.key
                                                ? "primary.main"
                                                : "text.secondary",
                                        borderBottom: "2px solid",
                                        borderColor:
                                            activeTab === tab.key ? "primary.main" : "transparent",
                                        borderRadius: 0,
                                        pb: 1,
                                        px: 2,
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </Stack>
                    </Box>

                    {/* Body */}
                    <DialogContent sx={{ px: 3, py: 2.5, minHeight: 360, maxHeight: "60vh" }}>
                        {/* ── Weekly Hours ── */}
                        {activeTab === "hours" && (
                            <Box>
                                {/* Appointment Types */}
                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    color="text.secondary"
                                    sx={{ display: "block", mb: 0.75 }}
                                >
                                    ACCEPTED APPOINTMENT TYPES
                                </Typography>
                                <Card
                                    variant="outlined"
                                    sx={{ px: 2, py: 1, mb: 2.5 }}
                                >
                                    <Stack
                                        direction="row"
                                        flexWrap="wrap"
                                    >
                                        {ALL_APPOINTMENT_TYPES.map((type) => (
                                            <FormControlLabel
                                                key={type}
                                                control={
                                                    <Checkbox
                                                        size="small"
                                                        checked={allowedAppointments.includes(type)}
                                                        onChange={() => toggleAppointmentType(type)}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2">{type}</Typography>
                                                }
                                            />
                                        ))}
                                    </Stack>
                                </Card>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Toggle days on or off, set your hours, and set how many
                                    appointments you're willing to take that day.
                                </Typography>
                                <Stack spacing={1.25}>
                                    {DAYS.map((day) => {
                                        const d = weeklyHours[day];
                                        return (
                                            <Card
                                                key={day}
                                                variant="outlined"
                                                sx={{
                                                    px: 2,
                                                    py: 1.25,
                                                    opacity: d.enabled ? 1 : 0.45,
                                                    transition: "opacity 0.2s",
                                                    backgroundColor: d.enabled
                                                        ? "background.paper"
                                                        : "action.disabledBackground",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                size="small"
                                                                checked={d.enabled}
                                                                onChange={(e) =>
                                                                    updateDay(day, {
                                                                        enabled: e.target.checked,
                                                                    })
                                                                }
                                                            />
                                                        }
                                                        label={
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                                sx={{ width: 95 }}
                                                            >
                                                                {day}
                                                            </Typography>
                                                        }
                                                        labelPlacement="end"
                                                        sx={{ mr: 0, flex: 1 }}
                                                    />
                                                    <TextField
                                                        type="time"
                                                        size="small"
                                                        value={minutesToTime(d.startTime)}
                                                        disabled={!d.enabled}
                                                        onChange={(e) =>
                                                            updateDay(day, {
                                                                startTime: timeToMinutes(
                                                                    e.target.value,
                                                                ),
                                                            })
                                                        }
                                                        sx={{ width: 120 }}
                                                        inputProps={{ step: 900 }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        to
                                                    </Typography>
                                                    <TextField
                                                        type="time"
                                                        size="small"
                                                        value={minutesToTime(d.endTime)}
                                                        disabled={!d.enabled}
                                                        onChange={(e) =>
                                                            updateDay(day, {
                                                                endTime: timeToMinutes(
                                                                    e.target.value,
                                                                ),
                                                            })
                                                        }
                                                        sx={{ width: 120 }}
                                                        inputProps={{ step: 900 }}
                                                    />
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        label="Capacity"
                                                        value={d.capacity}
                                                        disabled={!d.enabled}
                                                        onChange={(e) =>
                                                            updateDay(day, {
                                                                capacity: Math.max(
                                                                    1,
                                                                    Number(e.target.value),
                                                                ),
                                                            })
                                                        }
                                                        sx={{ width: 85 }}
                                                        inputProps={{ min: 1 }}
                                                    />
                                                </Box>
                                            </Card>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}

                        {/* ── Summary ── */}
                        {activeTab === "summary" && (
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2.5 }}
                                >
                                    A snapshot of your current availability settings.
                                </Typography>

                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    color="text.secondary"
                                    sx={{ mb: 1, display: "block" }}
                                >
                                    ACCEPTED APPOINTMENT TYPES
                                </Typography>
                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    gap={0.75}
                                    sx={{ mb: 3 }}
                                >
                                    {allowedAppointments.length === 0 ? (
                                        <Typography
                                            variant="body2"
                                            color="error"
                                        >
                                            None selected
                                        </Typography>
                                    ) : (
                                        allowedAppointments.map((type) => (
                                            <Chip
                                                key={type}
                                                label={type}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        ))
                                    )}
                                </Stack>

                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    color="text.secondary"
                                    sx={{ mb: 1, display: "block" }}
                                >
                                    WEEKLY SCHEDULE
                                </Typography>
                                <Stack spacing={0.75}>
                                    {DAYS.map((day) => {
                                        const d = weeklyHours[day];
                                        return (
                                            <Box
                                                key={day}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1.5,
                                                }}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{ width: 100, fontWeight: 500 }}
                                                >
                                                    {day}
                                                </Typography>
                                                {d.enabled ? (
                                                    <Chip
                                                        label={`${minutesToTime(d.startTime)} – ${minutesToTime(d.endTime)}  ·  cap ${d.capacity}`}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        icon={<CheckCircleOutlineIcon />}
                                                    />
                                                ) : (
                                                    <Chip
                                                        label="Off"
                                                        size="small"
                                                        color="default"
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        )}
                    </DialogContent>

                    {/* Error */}
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mx: 3, mb: 1 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {/* Footer */}
                    <DialogActions
                        sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
                    >
                        <Button
                            variant="outlined"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={16}
                                        color="inherit"
                                    />
                                ) : (
                                    <SaveIcon />
                                )
                            }
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={saved}
                    autoHideDuration={3000}
                    onClose={() => setSaved(false)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        severity="success"
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        Availability saved successfully!
                    </Alert>
                </Snackbar>
            </ThemeProvider>
        </>
    );
};
