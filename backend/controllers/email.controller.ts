import { type Request, type Response } from "express";
import EmailService from "../services/email.service.ts";
import { type EmailOptions } from "../config/email.ts";

/**
 * Handles POST /email/send
 */
async function sendEmail(req: Request<EmailOptions>, res: Response) {
    try {
        const emailInfo = req.body;
        await EmailService.sendEmail(emailInfo);
        return res.status(200).json();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Something went wrong!" });
    }
}

export default { sendEmail };
