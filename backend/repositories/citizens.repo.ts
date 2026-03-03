import { Citizen, type ICitizen } from "../models/citizens.model.ts";

import { type ClientSession } from "mongoose";

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

async function createCitizen(newCitizen: ICitizen, session: ClientSession) {
    try {
        return await Citizen.create([newCitizen], { session: session });
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

async function updateCitizen(id: string, updatedCitizen: ICitizen, session: ClientSession) {
    try {
        await Citizen.findByIdAndUpdate(id, updatedCitizen).session(session);
        return await getCitizenById(id);
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

async function deleteCitizen(id: string, session: ClientSession) {
    try {
        return await Citizen.findByIdAndDelete(id).session(session);
    } catch (error) {
        //TODO 500 error
        console.log(error);
    }
}

export default { getAllCitizens, getCitizenById, createCitizen, updateCitizen, deleteCitizen };
