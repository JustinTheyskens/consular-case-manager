import { type ICitizen } from "../models/citizens.model.ts";
import citizenRepo from "../repositories/citizens.repository.ts";

async function getAllCitizens() {
    return await citizenRepo.getAllCitizens();
}

async function getCitizenById(id: string) {
    return await citizenRepo.getCitizenById(id);
}

async function createCitizen(newCitizen: ICitizen) {
    return await citizenRepo.createCitizen(newCitizen);
}

async function updateCitizen(id: string, updatedCitizen: ICitizen) {
    return await citizenRepo.updateCitizen(id, updatedCitizen);
}

async function deleteCitizen(id: string) {
    return await citizenRepo.deleteCitizen(id);
}

export default { getAllCitizens, getCitizenById, createCitizen, updateCitizen, deleteCitizen };
