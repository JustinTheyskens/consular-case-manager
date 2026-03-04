import { Dialog, DialogTitle } from "@mui/material";
import CreateAppointmentForm from "../forms/CreateAppointmentForm";
import { useState } from "react";
import type { AppointmentType } from "../../layout/CitizenDashboardLayout";
import type { PickerValue } from "@mui/x-date-pickers/internals";
import { useCreateCaseMutation } from "../../api/endpoints/CasesAPI";
import { useSendEmailMutation } from "../../api/endpoints/EmailAPI";
import type { RootState } from "../../store/Store";
import { useSelector } from "react-redux";
import type { Appointment } from "../../api/endpoints/AppointmentsAPI";
import dayjs from "dayjs";

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
    const [sendEmail] = useSendEmailMutation();

    //To even be on this page, we know this info has to exist.
    //It is enforced by the route.
    const { userId, emailAddress } = useSelector((state: RootState) => state.session);

    async function onDialogSubmit(selectedDateTime: PickerValue | undefined) {
        try {
            const newAppointment: Appointment = {
                type: appointment.type,
                time: selectedDateTime ? selectedDateTime.utc().toISOString() : "",
            };

            const newCase = {
                appointment: newAppointment,
                citizen: userId!,
            };

            const response = await createCase(newCase).unwrap();

            await sendEmail({
                to: emailAddress!,
                subject: "Your appointment has been scheduled",
                text: `Dear ${response.citizen.firstName},\n\nYour appointment for ${response.appointment.type} has been scheduled for ${dayjs(response.appointment.time).tz(dayjs.tz.guess()).format("MMMM D, YYYY h:mm A")}.\n\nShould you need to modify or cancel your appointment, you can use the following reference number:\n\n${response.reference}\n\nBest regards,\nConsular Case Manager`,
            }).unwrap();

            closeModal();
        } catch (err) {
            //Just give them a really generic error message, it doesn't really matter why it failed.
            setErrorMessage("Failed to create appointment. Please try again.");
        }
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
