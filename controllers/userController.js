import { userAddressModel, userModel } from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendMail.js";
import crypto from "crypto";

// Register a new user

export const createUser = catchAsyncError(async (req, res, next) => {
  const { name, phone, email, password, username, address } = req.body;

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const user = await userModel.create({
    name,
    username,
    phone,
    email,
    password,
    // address,
  });
  sendToken(user, 201, "user registered successfully", res);
});

// Login User

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, username, password } = req.body;
  // console.log(username, email, password);

  if (!(username || email) && !password) {
    return next(new ErrorHandler("Please enter username and Password", 400));
  }

  const user = await userModel
    .findOne({ $or: [{ email }, { username }] })
    .select("+password");

  if (!user) {
    return next(
      new ErrorHandler(`Invalid ${Object.keys(req.body)[0]} or password`, 401)
    );
  }
  if (!user.status) {
    return next(
      new ErrorHandler("You do not have access to log in to this portal", 401)
    );
  }

  const isPasswordMatched = await user.comparePassword(password);
  // console.log(isPasswordMatched, "hiiii")

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(`Invalid ${Object.keys(req.body)[0]} or password`, 401)
    );
  }
  sendToken(user, 201, "Login Successful", res);
});

//logout user
export const logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

//forgot password

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const baseUrl = req.headers.origin || `${req.protocol}://${req.get("host")}`;
  const resetPasswordUrl = `${baseUrl}/api/users/resetpassword/${resetToken}`;
  const message = `Your password reset token is:\n\n${resetPasswordUrl}\n\n If you did not request this email,please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Your Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//reset password
export const userResetPassword = catchAsyncError(async (req, res, next) => {
  //creating token with help of crypto module
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await userModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset Token is invalid or has been expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords doesnot match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Password Reset Successfull", res);
});

//update user password

export const updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await userModel.findById(req.params.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  if (req.body.newPassword === req.body.oldPassword) {
    return next(
      new ErrorHandler("New Password cannot be same as old one", 400)
    );
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Confirm Password doesnot match", 400));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, "Password Changed Successfully", res);
});

//Get All Users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = await userModel.find();
  res.status(200).json({
    success: true,
    user,
  });
});

export const getUserById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }
  const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    updatedUser,
  });
});

//Address controller

export const addAddress = catchAsyncError(async (req, res, next) => {
  const { vill, post, district, state, user } = req.body;

  const address = await userAddressModel.create({
    vill,
    post,
    district,
    state,
    user,
  });
  res.status(200).json({
    success: true,
    message: "Address added Successfully",
    address,
  });
});

export const getAllAddress = catchAsyncError(async (req, res, next) => {
  const allAddress = await userAddressModel.find();
  res.status(200).json({
    success: true,
    allAddress,
  });
});

export const getAddressById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const address = await userAddressModel.findById(id);
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }
  res.status(200).json({
    success: true,
    address,
  });
});

export const updateAddress = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const address = await userAddressModel.findById(id);
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }
  const updatedAddress = await userAddressModel.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Address Updated Successfully",
    updatedAddress,
  });
});

export const deleteAddress = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;
  const address = await userAddressModel.findByIdAndDelete(id);
  if (!address) {
    return next(new ErrorHandler("Address not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Address deleted Successfully",
  });
});
