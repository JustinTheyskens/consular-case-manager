import LoginRepository from "../repositories/logins.repo.ts";

export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Verifies a given email and password
 * @param email The email of the user
 * @param password The password of the user
 */
async function verifyLogin(email: string, password: string) {
    const info = await LoginRepository.findLoginByEmailAndPassword(email, password);

    if (info != null) {
        return info.ref;
    }

    throw new ReferenceError("No user found with email and password combination.");
}

const LoginService = {
    verifyLogin
};

export default LoginService;
