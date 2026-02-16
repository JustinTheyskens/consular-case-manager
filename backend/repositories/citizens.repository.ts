import { Citizen, type ICitizen } from "../models/citizen.model.ts";

async function getAllCitizens() {
    try {
        return await Citizen.find();
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

async function getCitizenById(id: string) {
    try {
        return await Citizen.findById(id);
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

export default { getAllCitizens, getCitizenById };
