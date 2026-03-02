import { Dialog, DialogTitle } from "@mui/material";
import CreateAppointmentForm from "../forms/CreateAppointmentForm";
import { useState } from "react";
import type { AppointmentType } from "../../layout/CitizenDashboardLayout";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface CreateAppointmentDialogProps {
    isOpen: boolean;
    //We always set an appointment type before opening the model
    //But it is null by default
    appointment: AppointmentType | undefined;
}

export default function CreateAppointmentModal({
    isOpen,
    appointment,
}: CreateAppointmentDialogProps) {
    const [errorMessage, setErrorMessage] = useState("");

    function onDialogSubmit(selectedDateTime: PickerValue | undefined) {
        console.log("Submitted DateTime");
        console.log(selectedDateTime);
    }

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle>{`Create appointment for ${appointment?.label}`}</DialogTitle>
                <CreateAppointmentForm
                    onSubmit={onDialogSubmit}
                    errorMessage={errorMessage}
                    appointmentType={appointment?.type}
                />
            </Dialog>
        </>
    );
}
