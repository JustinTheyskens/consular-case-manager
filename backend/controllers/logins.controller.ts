import { type Request, type Response } from "express";
import { Types } from "mongoose";
import LoginService from "../services/logins.service.ts";

export interface LoginRequestBody {
    email: string;
    password: string;
}

/**
 * Handles POST /login
 */
async function verifyLogin(req: Request<null, Object, LoginRequestBody>, res: Response) {
    try {
        const { email, password } = req.body;
        const ref = await LoginService.verifyLogin(email, password);

        return res.status(200).json({ userId: ref });
    } catch (error) {
        if (error instanceof ReferenceError) {
            return res.status(401).send({ message: "Email and Password do not match."});
        } else {
            console.error(error);
            return res.status(500).send({ message: "Something went wrong!" });
        }
    }
}

const LoginController = {
    verifyLogin
};

export default LoginController;
