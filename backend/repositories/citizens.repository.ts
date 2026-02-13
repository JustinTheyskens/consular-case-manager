//IMPORT CITIZEN MODEL

async function getAllCitizens() {
    let allCitizens;
    await Citizen.find()
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
    await Citizen.findById(id)
        .then((res: ICitizen) => {
            citizen = res;
        })
        .catch((error: Error) => {
            console.log(error);
            throw new Error("getAllCitizens Repo recieved Error with DB");
        });
    return citizen;
}

export default { getAllCitizens, getCitizenById };
