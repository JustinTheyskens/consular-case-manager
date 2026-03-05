import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
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
import { useState } from "react";
import { theme } from "../theme";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

export interface DayAvailability {
    enabled: boolean;
    start: string;
    end: string;
}

interface AvailabilityModalProps {
    open: boolean;
    onClose: () => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_WEEKLY_HOURS: Record<string, DayAvailability> = {
    Monday: { enabled: true, start: "09:00", end: "17:00" },
    Tuesday: { enabled: true, start: "09:00", end: "17:00" },
    Wednesday: { enabled: true, start: "09:00", end: "17:00" },
    Thursday: { enabled: true, start: "09:00", end: "17:00" },
    Friday: { enabled: true, start: "09:00", end: "15:00" },
    Saturday: { enabled: false, start: "10:00", end: "14:00" },
    Sunday: { enabled: false, start: "10:00", end: "14:00" },
};

export const AvailabilityModal = ({ open, onClose }: AvailabilityModalProps) => {
    const [activeTab, setActiveTab] = useState<"hours" | "summary">("hours");
    const [saved, setSaved] = useState(false);
    const [weeklyHours, setWeeklyHours] =
        useState<Record<string, DayAvailability>>(DEFAULT_WEEKLY_HOURS);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        onClose();
    };

    const updateDay = (day: string, patch: Partial<DayAvailability>) =>
        setWeeklyHours((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));

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
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    Toggle days on or off and set your start and end times for each
                                    working day.
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
                                                        value={d.start}
                                                        disabled={!d.enabled}
                                                        onChange={(e) =>
                                                            updateDay(day, {
                                                                start: e.target.value,
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
                                                        value={d.end}
                                                        disabled={!d.enabled}
                                                        onChange={(e) =>
                                                            updateDay(day, { end: e.target.value })
                                                        }
                                                        sx={{ width: 120 }}
                                                        inputProps={{ step: 900 }}
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
                                                        label={`${d.start} – ${d.end}`}
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

                    {/* Footer */}
                    <DialogActions
                        sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
                    >
                        <Button
                            variant="outlined"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                        >
                            Save Changes
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
