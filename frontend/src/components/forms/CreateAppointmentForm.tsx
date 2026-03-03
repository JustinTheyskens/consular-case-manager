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
    errorMessage: string;
    appointmentType: string | undefined;
}

export default function CreateAppointmentForm({
    onSubmit,
    errorMessage,
    appointmentType,
}: CreateAppointmentFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState<PickerValue>(null);
    const { data: availabilities } = useGetTimesQuery(appointmentType);

    // DateTimePicker events fire too often to handle this calculation directly in it's event functions
    // So instead this is handled by useMemo for performance reasons
    // DateTimePicker's event functions can then just use these pre-calculated values
    const { enabledDays, availabilityLookup } = useMemo(() => {
        if (!availabilities || !Array.isArray(availabilities) || availabilities.length === 0) {
            return {
                enabledDays: new Set<number>(),
                availabilityLookup: new Map<number, Set<string>>(),
            };
        }

        const days = new Set<number>();
        const lookup = new Map<number, Set<string>>();

        for (const timestamp of availabilities) {
            const asDate = dayjs.utc(timestamp).tz(clientTimeZone);
            const dayOfWeek = asDate.day();
            days.add(dayOfWeek);

            if (!lookup.has(dayOfWeek)) {
                lookup.set(dayOfWeek, new Set());
            }
            lookup.get(dayOfWeek)!.add(`${asDate.hour()}:${asDate.minute()}`);
        }

        return { enabledDays: days, availabilityLookup: lookup };
    }, [availabilities]);

    const now = useMemo(() => dayjs(), [availabilities]);
    const twoWeeksOut = useMemo(() => now.add(15, "day"), [now]);

    function submitForm(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmitting(true);

        onSubmit(selectedDateTime);

        //We should only reach this in case of some kind of error
        //In which case, we want to make the button clickable again
        setSubmitting(false);
    }

    function shouldDisableDay(day: PickerValidDate) {
        if (enabledDays.size === 0) return true;

        //Only enable days that are within the next two weeks and match the day of the week of any availability timestamp
        return !(day.isBefore(twoWeeksOut) && day.isAfter(now) && enabledDays.has(day.day()));
    }

    function shouldDisableTime(time: PickerValidDate, view: TimeView) {
        if (availabilityLookup.size === 0) return true;

        const timesForDay = availabilityLookup.get(time.day());
        if (!timesForDay) return true;

        if (view === "hours") {
            // Enable this hour if any availability on this day has this hour
            for (const key of timesForDay) {
                if (parseInt(key.split(":")[0]) === time.hour()) return false;
            }
            return true;
        }

        if (view === "minutes") {
            // Enable this minute if there's an exact hour:minute match
            // Since we enforce 30 minute steps, this probably won't ever be relevant
            // However this should allow us to change in the future should we want to support 15 minute steps or something like that
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
                        ampm={false}
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
