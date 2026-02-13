import citizenRepo from "../repositories/citizens.repository";

async function getAllCitizens() {
    let allCitizens;

    try {
        let allCitizens = await citizenRepo.getAllCitizens();
    } catch (error) {
        //TODO: Typed errors for specific error messages?
        throw new Error("getAllCitizens Service recieved error from Repo");
    }

    return allCitizens;
}

async function getCitizenById(id: string) {
    let citizen;

    try {
        citizen = await citizenRepo.getAllCitizens();
    } catch (error) {
        //TODO: Typed errors for specific error messages?
        throw new Error("getCitizenById Service recieved error from Repo");
    }

    return citizen;
}

export default { getAllCitizens, getCitizenById };
