import express from "express";
import {
  deleteAppointment,
  getAllAppointments,
  postAppointment,
  updateAppointmentStatus,
  getStats,
} from "../controller/appointmentsController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middleware/auth.js";

const router = express.Router();

router
  .route("/post")
  .post(isPatientAuthenticated, postAppointment);
router
  .route("/getall")
  .get(isAdminAuthenticated, getAllAppointments);
router
  .route("/update/:id")
  .put(isAdminAuthenticated, updateAppointmentStatus);
router
  .route("/delete/:id")
  .delete(isAdminAuthenticated, deleteAppointment);
router
  .route("/stats")
  .get(isAdminAuthenticated, getStats);

export default router;
