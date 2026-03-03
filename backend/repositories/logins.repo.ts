import { Login, type ILogin } from "../models/logins.model.ts";

import { type ClientSession } from "mongoose";

/**
 * Finds and returns an account with given email and login
 * @returns A promise of the account associated with the email and login
 */
function findLoginByEmailAndPassword(email: string, password: string) {
    return Login.findOne({ email: email, password: password }).exec();
}

/**
 * Creates a new login with given data
 * @param data The data of the login to create
 * @param session The transactional session to use
 * @returns A promise with the created login
 */
function createLogin(data: ILogin, session: ClientSession) {
    return Login.create([data], { session: session });
}

/**
 * Updates a login with given user ID
 * @param userId The user ID of the login to update
 * @param newData The new login data to replace the old
 * @param session The transactional session to use
 * @returns A promise with the updated login
 */
async function updateLogin(userId: string, newData: ILogin, session: ClientSession) {
    return Login.findOneAndUpdate({ ref: userId }, newData, { returnDocument: "after" })
        .session(session)
        .exec();
}

/**
 * Deletes a login with given userId
 * @param userId The user ID of the login to delete
 * @param session The transactional session to use
 * @returns A promise with the deleted login
 */
function deleteLogin(userId: string, session: ClientSession) {
    return Login.findOneAndDelete({ ref: userId }).session(session).exec();
}

const LoginRepository = {
    findLoginByEmailAndPassword,
    createLogin,
    updateLogin,
    deleteLogin,
};

export default LoginRepository;
