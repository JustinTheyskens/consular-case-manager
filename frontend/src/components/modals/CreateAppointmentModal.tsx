import { Dialog, DialogTitle } from "@mui/material";
import CreateAppointmentForm from "../forms/CreateAppointmentForm";
import { useState } from "react";
import type { AppointmentType } from "../../layout/CitizenDashboardLayout";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface CreateAppointmentDialogProps {
    isOpen: boolean;
    //We always set an appointment type before opening the model
    //But it is null by default
    appointmentType: AppointmentType | null;
}

export default function CreateAppointmentModal({
    isOpen,
    appointmentType,
}: CreateAppointmentDialogProps) {
    const [errorMessage, setErrorMessage] = useState("");

    function onDialogSubmit(selectedDateTime: PickerValue | undefined) {
        console.log("Submitted DateTime");
        console.log(selectedDateTime);
    }

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle>{`Craete appointment for ${appointmentType?.label}`}</DialogTitle>
                <CreateAppointmentForm
                    onSubmit={onDialogSubmit}
                    errorMessage={errorMessage}
                />
            </Dialog>
        </>
    );
}
