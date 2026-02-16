import citizenRepo from "../repositories/citizens.repository.ts";

async function getAllCitizens() {
    return await citizenRepo.getAllCitizens();
}

async function getCitizenById(id: string) {
    return await citizenRepo.getCitizenById(id);
}

export default { getAllCitizens, getCitizenById };
