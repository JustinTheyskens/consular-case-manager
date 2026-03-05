import { Citizen, type ICitizen } from "../models/citizens.model.ts";

import { type ClientSession } from "mongoose";

async function getAllCitizens() {
    return await Citizen.find();
}

async function getCitizenById(id: string) {
    return await Citizen.findById(id);
}

async function createCitizen(newCitizen: ICitizen, session: ClientSession) {
    return await Citizen.create([newCitizen], { session: session });
}

async function updateCitizen(id: string, updatedCitizen: ICitizen, session: ClientSession) {
    return await Citizen.findByIdAndUpdate(id, updatedCitizen, { returnDocument: "after" }).session(
        session,
    );
}

async function deleteCitizen(id: string, session: ClientSession) {
    return await Citizen.findByIdAndDelete(id).session(session);
}

export default { getAllCitizens, getCitizenById, createCitizen, updateCitizen, deleteCitizen };
