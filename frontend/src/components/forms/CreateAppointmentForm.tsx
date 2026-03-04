import { Button, Box, Alert } from "@mui/material";
import { LocalizationProvider, type PickerValidDate, type TimeView } from "@mui/x-date-pickers";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { useState, useMemo } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useGetTimesQuery } from "../../api/endpoints/AvailabilityAPI";

dayjs.extend(utc);
dayjs.extend(timezone);
const clientTimeZone = dayjs.tz.guess();

interface CreateAppointmentFormProps {
    onSubmit: (selectedDateTime: PickerValue | undefined) => void;
    onCancel?: () => void;
    errorMessage: string;
    appointmentType: string | undefined;
}

export default function CreateAppointmentForm({
    onSubmit,
    onCancel,
    errorMessage,
    appointmentType,
}: CreateAppointmentFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<PickerValue>(null);
    const { data: availabilities } = useGetTimesQuery(appointmentType, {
        skip: !appointmentType,
        refetchOnMountOrArgChange: true,
    });

    // DateTimePicker events fire too often to handle this calculation directly in it's event functions
    // So instead this is handled by useMemo for performance reasons
    // DateTimePicker's event functions can then just use these pre-calculated values
    const { enabledDays, availabilityLookup } = useMemo(() => {
        if (!availabilities || !Array.isArray(availabilities) || availabilities.length === 0) {
            return {
                enabledDays: new Set<string>(),
                availabilityLookup: new Map<string, Set<string>>(),
            };
        }

        const days = new Set<string>();
        const lookup = new Map<string, Set<string>>();

        for (const timestamp of availabilities) {
            const asDate = dayjs.utc(timestamp).tz(clientTimeZone);
            const dateKey = asDate.format("YYYY-MM-DD");
            days.add(dateKey);

            if (!lookup.has(dateKey)) {
                lookup.set(dateKey, new Set());
            }
            lookup.get(dateKey)!.add(`${asDate.hour()}:${asDate.minute()}`);
        }

        return { enabledDays: days, availabilityLookup: lookup };
    }, [availabilities]);

    const firstAvailableDate = useMemo(() => {
        //Just default to "now" if availabilities is empty
        if (!availabilities || !Array.isArray(availabilities) || availabilities.length === 0) {
            return dayjs().tz(clientTimeZone);
        }
        return dayjs.utc(availabilities[0]).tz(clientTimeZone);
    }, [availabilities]);

    function submitForm(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmitting(true);

        onSubmit(selectedDateTime);

        setSubmitting(false);
    }

    function shouldDisableDay(day: PickerValidDate) {
        if (enabledDays.size === 0) return true;

        const dateKey = day.format("YYYY-MM-DD");
        return !enabledDays.has(dateKey);
    }

    function shouldDisableTime(time: PickerValidDate, view: TimeView) {
        if (availabilityLookup.size === 0) return true;

        const dateKey = time.format("YYYY-MM-DD");
        const timesForDay = availabilityLookup.get(dateKey);
        if (!timesForDay) return true;

        if (view === "hours") {
            for (const key of timesForDay) {
                if (parseInt(key.split(":")[0]) === time.hour()) return false;
            }
            return true;
        }

        if (view === "minutes") {
            return !timesForDay.has(`${time.hour()}:${time.minute()}`);
        }

        return true;
    }

    return (
        <>
            <Box
                component="form"
                onSubmit={submitForm}
                sx={{ display: "flex", flexDirection: "column", justifyContent: "center", my: 2 }}
            >
                <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="en"
                >
                    <DesktopDateTimePicker
                        value={selectedDateTime}
                        onChange={(newValue) => {
                            setSelectedDateTime(newValue);
                        }}
                        disablePast
                        minutesStep={30}
                        shouldDisableDate={shouldDisableDay}
                        shouldDisableTime={shouldDisableTime}
                        referenceDate={firstAvailableDate}
                        ampm={false}
                        sx={{ m: 2 }}
                    />
                </LocalizationProvider>

                <Button
                    type="submit"
                    disabled={submitting}
                    variant="contained"
                    sx={{ m: 2 }}
                >
                    Submit
                </Button>

                <Button
                    color="error"
                    disabled={submitting}
                    variant="contained"
                    sx={{ m: 2 }}
                    onClick={onCancel}
                >
                    Cancel
                </Button>

                {errorMessage ? (
                    <Box>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                ) : (
                    <></>
                )}
            </Box>
        </>
    );
}
