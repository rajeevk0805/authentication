import catchAsyncError from "../middlewares/catchAsyncError.js";
import { centerModel } from "../models/centerModel.js";
import ErrorHandler from "../utils/errorHandler.js";

export const center = catchAsyncError(async (req, res, next) => {
  const {
    name,
    address,
    location,
    sitting_date,
    sitting_time,
    maximum_booking,
    booking,
  } = req.body;

  const existingCenter = await centerModel.findOne({ name });
  if (existingCenter) {
    return next(new ErrorHandler("Center already exists", 400));
  }
  const newCenter = await centerModel.create({
    name,
    address,
    location,
    sitting_date,
    sitting_time,
    maximum_booking,
    booking,
  });
  res.status(201).json({
    success: true,
    message: "Center created successfully",
    newCenter,
  });
});

//get all centers
export const getAllCenters = catchAsyncError(async (req, res, next) => {
  const allcenters = await centerModel.find();
  res.status(200).json({
    success: true,
    message: "All Centers",
    allcenters,
  });
});

//get center by id

export const getSingleCenter = catchAsyncError(async (req, res, next) => {
  const center_id = req.params.id;
  const center = await centerModel.findById(center_id);
  if (!center) {
    return next(new ErrorHandler("Center not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Center details",
    center,
  });
});

//Update Center

export const updateCenter = catchAsyncError(async (req, res, next) => {
  const centerId = req.params.id;
  const center = await centerModel.findById(centerId);
  if (!center) {
    return next(new ErrorHandler("Center not found", 404));
  }
  const updatedCenter = await centerModel.findByIdAndUpdate(
    centerId,
    req.body,
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Center updated",
    updatedCenter,
  });
});


//delete center
export const deleteCenter=catchAsyncError(async(req,res,next)=>{
  const centerId=req.params.id;
  const center=await centerModel.findByIdAndDelete(centerId)
  if(!center){
      return next(new ErrorHandler('Center not found',404))
  } res.status(200).json({success:true,
    message:"CEnter Deleted Successfully"
  })
})