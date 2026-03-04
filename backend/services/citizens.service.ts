import { MongooseError } from "mongoose";
import { type ICitizen } from "../models/citizens.model.ts";
import { type ILogin } from "../models/logins.model.ts";
import citizenRepo from "../repositories/citizens.repo.ts";
import LoginRepository from "../repositories/logins.repo.ts";

import { startSession } from "mongoose";

export interface ICitizenAccount extends ICitizen {
    email: string;
    password: string;
}

async function getAllCitizens() {
    return await citizenRepo.getAllCitizens();
}

async function getCitizenById(id: string) {
    return await citizenRepo.getCitizenById(id);
}

async function createCitizen(newCitizen: ICitizenAccount) {
    // Begins mongoose transaction for integrity (create both a login and citizen document)
    const session = await startSession();

    try {
        return await session.withTransaction(async () => {
            const [citizen] = (await citizenRepo.createCitizen(newCitizen, session)) as ICitizen[];

            const { _id } = citizen;
            const { email, password } = newCitizen;

            await LoginRepository.createLogin(
                {
                    email,
                    password,
                    type: "citizen",
                    ref: _id,
                } as ILogin,
                session,
            );

            return citizen;
        });
    } catch (error: any) {
        if (error.code === 11000) {
            throw new RangeError("Email already exists");
        }
        console.error(error);
        throw new MongooseError("Internal error: could not create citizen");
    } finally {
        session.endSession();
    }
}

async function updateCitizen(id: string, updatedCitizen: ICitizenAccount) {
    // Begins mongoose transaction for integrity (update both a login and citizen document)
    const session = await startSession();

    try {
        return await session.withTransaction(async () => {
            const citizen = (await citizenRepo.updateCitizen(
                id,
                updatedCitizen,
                session,
            )) as ICitizen;

            const { email, password } = updatedCitizen;

            await LoginRepository.updateLogin(id, { email, password } as ILogin, session);

            return citizen;
        });
    } catch (error: any) {
        if (error.code === 11000) {
            throw new RangeError("Email already exists");
        }
        console.error(error);
        throw new MongooseError("Internal error: could not update citizen");
    } finally {
        session.endSession();
    }
}

async function deleteCitizen(id: string) {
    // Begins mongoose transaction for integrity (delete both the citizen and associated login document)
    const session = await startSession();

    try {
        return await session.withTransaction(async () => {
            await LoginRepository.deleteLogin(id, session);
            return await citizenRepo.deleteCitizen(id, session);
        });
    } catch (error) {
        console.error(error);
        throw new MongooseError("Internal error: could not delete citizen");
    } finally {
        session.endSession();
    }
}

export default { getAllCitizens, getCitizenById, createCitizen, updateCitizen, deleteCitizen };
