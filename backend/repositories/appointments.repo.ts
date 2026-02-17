import { Appointment, type IAppointment } from "../models/appointments.model.ts";

/**
 * Creates a new appointment with given data
 * @param data The data of the appointment to create
 * @returns A promise with the created appointment
 */
function createAppointment(data: IAppointment) {
    return Appointment.create(data);
}

/**
 * Updates an appointment with given id
 * @param _id The id of the Appointment file to update
 * @param newData The new Appointment file data to replace the old
 * @returns A promise with the updated appointment file
 */
async function updateAppointment(_id: string, newData: IAppointment) {
    return Appointment.findByIdAndUpdate(_id, newData, { returnDocument: "after" })
        .exec();
}

const AppointmentRepository = {
    createAppointment,
    updateAppointment,
};

export default AppointmentRepository;
