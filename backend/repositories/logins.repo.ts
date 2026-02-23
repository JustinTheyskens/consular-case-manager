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
 * Updates a login with given user ID
 * @param userId The user ID of the login to update
 * @param newData The new login data to replace the old
 * @returns A promise with the updated login
 */
async function updateLogin(userId: string, newData: ILogin) {
    return Login.findOneAndUpdate({ ref: userId }, newData, { returnDocument: "after" })
        .exec();
}

/**
 * Deletes a login with given userId
 * @param userId The user ID of the login to delete
 * @returns A promise with the deleted login
 */
function deleteLogin(userId: string) {
    return Login.findOneAndDelete({ ref: userId }).exec();
}

const LoginRepository = {
    findLoginByEmailAndPassword,
    createLogin,
    updateLogin,
    deleteLogin
};

export default LoginRepository;
