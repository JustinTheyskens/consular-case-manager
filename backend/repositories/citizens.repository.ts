import { Citizen, type ICitizen } from "../models/citizens.model.ts";

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

async function createCitizen(newCitizen: ICitizen) {
    try {
        return await Citizen.create(newCitizen);
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

async function updateCitizen(id: string, updatedCitizen: ICitizen) {
    try {
        await Citizen.findByIdAndUpdate(id, updatedCitizen);
        return await getCitizenById(id);
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

async function deleteCitizen(id: string) {
    try {
        return await Citizen.findByIdAndDelete(id);
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

export default { getAllCitizens, getCitizenById, createCitizen, updateCitizen, deleteCitizen };
