import { type ICase } from "../models/cases.model.ts";
import { type IAppointment } from "../models/appointments.model.ts";
import CaseRepository from "../repositories/cases.repo.ts";
import AppointmentRepository from "../repositories/appointments.repo.ts";

import { startSession } from "mongoose";

/**
 * Gets all cases in from the repository
 * @returns A promise containing all case files found
 */
async function getAll() {
    return await CaseRepository.findAll();
}

/**
 * Gets a case file with specific reference number
 * @param ref The reference number of the case to search
 * @returns A promise containing the case file found
 */
async function getCaseByReference(ref: number) {
    return await CaseRepository.findCaseByRef(ref);
}

/**
 * Creates a new case file with given data
 * @param data The data to populate the case file with
 * @returns A promise containing the new case file
 */
async function createCase(data: ICase) {
    // Begins mongoose transaction for integrity (atomically transfer items)
    const session = await startSession();
    let returnValue: ICase | null = null;

    try {
        await session.withTransaction(async () => {
            // First creates an appointment
            const { appointment } = data;
            const appointmentDetails = appointment as IAppointment; 

            const { _id } = await AppointmentRepository.createAppointment(appointmentDetails);

            // Creates a case with the linked appointment
            returnValue = await CaseRepository.createCase({ ...data, appointment: _id } as ICase); 
        });
    } catch (error) {
        console.error(error);
        throw new Error("Case creation was attempted but was unsuccessful");
    } finally {
        await session.endSession();
        
        return returnValue;
    }
}

/**
 * Updates a case file with given reference number and data
 * @param ref The reference number of the case to search
 * @param data The new data of the case file
 * @returns A promise containing the updated case file
 */
async function updateCase(ref: number, data: ICase) {
    return await CaseRepository.updateCase(ref, data);
}

/**
 * Deletes a case file with specific reference number
 * @param ref The reference number of the case to delete
 * @returns A promise containing the case file deleted
 */
async function deleteCase(ref: number) {
    return await CaseRepository.deleteCase(ref);
}

const CaseService = {
    getAll,
    getCaseByReference,
    createCase,
    updateCase,
    deleteCase,
};

export default CaseService;
