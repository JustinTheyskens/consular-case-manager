import { Citizen, ICitizen } from "../models/citizen.model";

async function getAllCitizens() {
    let allCitizens;
    Citizen.find()
        .then((res: ICitizen[]) => {
            allCitizens = res;
        })
        .catch((error: Error) => {
            console.log(error);
            throw new Error("getAllCitizens Repo recieved Error with DB");
        });
    return allCitizens;
}

async function getCitizenById(id: string) {
    let citizen;
    Citizen.findById(id)
        .then((res: ICitizen | null) => {
            citizen = res;
        })
        .catch((error: Error) => {
            console.log(error);
            throw new Error("getAllCitizens Repo recieved Error with DB");
        });
    return citizen;
}

export default { getAllCitizens, getCitizenById };
