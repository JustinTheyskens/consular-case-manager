import { type IAppointment } from "../models/appointments.model.ts";
import AppointmentRepository from "../repositories/appointments.repo.ts";

/**
 * Updates an appointment with given id and data
 * @param id The id of the appointment to update
 * @param data The new data of the appointment
 * @returns A promise containing the updated appointment
 */
async function updateAppointment(id: string, data: IAppointment) {
    return await AppointmentRepository.updateAppointment(id, data);
}

const AppointmentService = {
    updateAppointment
};

export default AppointmentService;