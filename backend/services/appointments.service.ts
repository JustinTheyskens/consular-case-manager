import AppointmentRepository from "../repositories/appointments.repo.ts";

/**
 * Gets all appointments from the repository
 * @returns A promise containing all appointments found
 */
async function getAll() {
    return await AppointmentRepository.findAll();
}

const AppointmentService = {
    getAll,
};

export default AppointmentService;
