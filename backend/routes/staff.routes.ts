import express from "express";
import { type Request, type Response } from "express";
import { StaffController } from "../controllers/staff.controller.ts";

const router = express.Router();

router.route("/").get(StaffController.getAll).post(StaffController.create);

router
    .route("/:id")
    .get(StaffController.getById)
    .put(StaffController.update)
    .delete(StaffController.delete);

export default router;
