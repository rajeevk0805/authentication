import catchAsyncError from "../middlewares/catchAsyncError.js";
import { appointmentModel } from "../models/appointmentModel.js";
import ErrorHandler from "../utils/errorHandler.js";

//Create Appointment
export const createAppointment = catchAsyncError(async (req, res, next) => {
  const { patient_name, phone, email, center, date } = req.body;

  const existingAppointment = await appointmentModel.findOne({ email });
  if (existingAppointment) {
    return next(new ErrorHandler("an appointment is already Booked", 400));
  }
  const newAppointment = await appointmentModel.create({
    patient_name,
    phone,
    email,
    center,
    date,
  });
  res.status(201).json({
    success: true,
    message: "Appointment Booked Successfully",
    newAppointment,
  });
});

//Get all appointment

export const getAllAppointment = catchAsyncError(async (req, res, next) => {
  const allAppointments = await appointmentModel.find().populate("center","name")
  res.status(200).json({
    success: true,
    message: "All Appointments",
    allAppointments,
  });
});

//Get Appointments by id

export const getAppointmentById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const appointments = await appointmentModel.findById(id);
  if (!appointments) {
    return next(new ErrorHandler("No appointments available", 404));
  }
  res.status(200).json({
    success: true,
    message: "Appointment found",
    appointments,
  });
});

//Update Appointments

export const updateAppointment = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const appointments = await appointmentModel.findById(id);
  if (!appointments) {
    return next(new ErrorHandler("No appointments available", 404));
  }
  const updatedAppointment = await appointmentModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Appointment Updated",
    updatedAppointment,
  });
});

//Delete Appointment

export const deleteAppointment = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const appointment = await appointmentModel.findByIdAndDelete(id);
  if (!appointment) {
    return next(new ErrorHandler("No appointments available", 404));
  }
  res.status(200).json({
    success: true,
    message: "Appointment Deleted",
  });
});
