import express from "express";
import { type Request, type Response } from "express";
import LoginController, { type LoginRequestBody } from "../controllers/logins.controller.ts";

const router = express.Router();

router.route("/")
    .post(async (req: Request<null, Object, LoginRequestBody>, res: Response) => {
        LoginController.verifyLogin(req, res);
    });

export default router;