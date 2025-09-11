import express from "express";
import {
  createAppointment,
  deleteAppointment,
  getAllAppointment,
  getAppointmentById,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.route("/createappointment").post(createAppointment);
router.route("/getallappointment").get(getAllAppointment);
router.route("/getappointmentbyid/:id").get(getAppointmentById);
router.route("/updateappointment/:id").put(updateAppointment);
router.route("/deleteappointment/:id").delete(deleteAppointment);

export default router;
