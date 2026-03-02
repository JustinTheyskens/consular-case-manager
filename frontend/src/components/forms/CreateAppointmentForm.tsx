import { Button, Box, Alert } from "@mui/material";
import { LocalizationProvider, type PickerValidDate, type TimeView } from "@mui/x-date-pickers";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import { useGetTimesQuery } from "../../api/endpoints/AvailabilityAPI";

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

    function submitForm(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();

        setSubmitting(true);

        onSubmit(selectedDateTime);

        //We should only reach this in case of some kind of error
        //In which case, we want to make the button clickable again
        setSubmitting(false);
    }

    function shouldDisableDay(day: PickerValidDate) {
        //TODO: Any given day slot should be disabled if it is not included in the return from api/availabilities/times

        //Guard against falsey results, empty arrays, or empty objects
        if (!availabilities || !Array.isArray(availabilities) || availabilities.length === 0) {
            console.log("No availabilities, disabling all days");
            return true;
        }

        const now = dayjs();
        //Two weeks + 1 day to account for not being able to schedule "today"
        const twoWeeksOut = now.add(15, "day");

        console.log("Start Print");
        for (const timestamp in availabilities) {
            const asDate = dayjs(timestamp);
            console.log(asDate.toString());
            //Only enable days that are within the next two weeks and match the day of the week of any availability timestamp
            if (day.isBefore(twoWeeksOut) && day.isAfter(now) && day.day() == asDate.day()) {
                return false;
            }
        }

        return true;
    }

    function shouldDisableTime(time: PickerValidDate, view: TimeView) {
        if (!availabilities) return true;
        // if (view === "minutes") {
        //     console.log("Time PickerValidDate");
        //     console.log(time.toString());
        // }

        //TODO: Any given time slot should be disabled if it is not included in the return from api/availabilities/times
        return false;
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
