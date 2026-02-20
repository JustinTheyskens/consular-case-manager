import { Login, type ILogin } from "../models/logins.model.ts";

/**
 * Finds and returns an account with given email and login
 * @returns A promise of the account associated with the email and login
 */
function findLoginByEmailAndPassword(email: string, password: string) {
    return Login.findOne({ email: email, password: password })
        .exec();
}

/**
 * Creates a new login with given data
 * @param data The data of the login to create
 * @returns A promise with the created login
 */
function createLogin(data: ILogin) {
    return Login.create(data);
}

/**
 * Updates a login with given email
 * @param email The email of the login to update
 * @param newData The new login data to replace the old
 * @returns A promise with the updated login
 */
async function updateLogin(email: string, newData: ILogin) {
    return Login.findOneAndUpdate({ email: email }, newData, { returnDocument: "after" })
        .exec();
}

/**
 * Deletes a case file with given email
 * @returns A promise with the deleted login
 */
function deleteLogin(email: string) {
    return Login.findOneAndDelete({ email: email }).exec();
}

const LoginRepository = {
    findLoginByEmailAndPassword,
    createLogin,
    updateLogin,
    deleteLogin
};

export default LoginRepository;
