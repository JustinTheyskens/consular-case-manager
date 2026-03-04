import express from "express";
import { type Request, type Response } from "express";
import EmailController from "../controllers/email.controller.ts";
import { EmailOptions } from "../config/email.ts";

const router = express.Router();

router.route("/send").post(async (req: Request<EmailOptions>, res: Response) => {
    EmailController.sendEmail(req, res);
});

export default router;
