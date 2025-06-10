import { AppointmentModel } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middleware/auth.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    address,
    hasVisited,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return res.status(400).json({
      success: false,
      message: "Please Fill Full Form!",
    });
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Doctor not found",
    });
  }

  if (isConflict.length > 1) {
    return res.status(400).json({
      success: false,
      message:
        "Doctors Conflict! Please Contact Through Email Or Phone!",
    });
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await AppointmentModel.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
      doctorId,
    },
    patient: {
      patientId,
    },
    address,
    hasVisited,
  });
  res.status(200).json({
    success: true,
    message: "Appointment Send Successfully!",
    appointment,
  });
});

export const getAllAppointments = catchAsyncErrors(
  async (req, res, next) => {
    const appointments = await AppointmentModel.find();
    res.status(200).json({
      success: true,
      appointments,
    });
  }
);

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment Not Found!",
      });
    }
    appointment = await AppointmentModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
      appointment,
    });
  }
);

export const deleteAppointment = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const appointment = await AppointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment Not Found!",
      });
    }
    await appointment.deleteOne();
    res.status(200).json({
      success: true,
      message: "Appointment Deleted!",
    });
  }
);

export const getStats = catchAsyncErrors(async (req, res, next) => {
  const totalAppointments = await AppointmentModel.countDocuments();
  const totalDoctors = await User.countDocuments({ role: "Doctor" });
  res.status(200).json({
    success: true,
    stats: { totalAppointments, totalDoctors },
  });
});
