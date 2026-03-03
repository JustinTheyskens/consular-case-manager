import { Dialog, DialogTitle } from "@mui/material";
import CreateAppointmentForm from "../forms/CreateAppointmentForm";
import { useState } from "react";
import type { AppointmentType } from "../../layout/CitizenDashboardLayout";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import { useCreateCaseMutation } from "../../api/endpoints/CasesAPI";
import type { RootState } from "../../store/Store";
import { useSelector } from "react-redux";
import type { Appointment } from "../../api/endpoints/AppointmentsAPI";

interface CreateAppointmentModalProps {
    isOpen: boolean;
    //We always set an appointment type before opening the modal
    //But it is null by default
    appointment: AppointmentType;
    closeModal: () => void;
}

export default function CreateAppointmentModal({
    isOpen,
    appointment,
    closeModal,
}: CreateAppointmentModalProps) {
    const [errorMessage, setErrorMessage] = useState("");
    const [createCase] = useCreateCaseMutation();

    //To even be on this page, we know this userId has to exist.
    //It is enforced by the route.
    const { userId } = useSelector((state: RootState) => state.session);

    async function onDialogSubmit(selectedDateTime: PickerValue | undefined) {
        console.log("Submitted DateTime");
        console.log(selectedDateTime);

        const newAppointment: Appointment = {
            type: appointment.type,
            time: selectedDateTime ? selectedDateTime.utc().toISOString() : "",
        };

        const newCase = {
            appointment: newAppointment,
            citizen: userId!,
        };

        console.log("Submitted new case:");
        console.log(newCase);

        const response = await createCase(newCase).unwrap();

        console.log(response);

        closeModal();
    }

    function onDialogCancel() {
        closeModal();
    }

    return (
        <>
            <Dialog open={isOpen}>
                <DialogTitle>{`Create appointment for ${appointment?.label}`}</DialogTitle>
                <CreateAppointmentForm
                    onSubmit={onDialogSubmit}
                    errorMessage={errorMessage}
                    appointmentType={appointment?.type}
                    onCancel={onDialogCancel}
                />
            </Dialog>
        </>
    );
}
