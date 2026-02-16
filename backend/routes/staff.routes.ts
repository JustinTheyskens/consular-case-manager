import express from "express";
import { type Request, type Response } from "express";
import { StaffController } from "../controllers/staff.controller";

const router = express.Router();

router.route("/").get(StaffController.getAll).post(StaffController.create);

router
    .route("/:id")
    .get(StaffController.getById)
    .put(StaffController.update)
    .delete(StaffController.delete);

/* Prob won't use if everything is in update */
// router
//     .patch("/:id/availability/:day",
//         StaffController.updateAvailabilityDay
//     );

export default router;
