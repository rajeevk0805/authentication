import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import { userModel} from '../models/userModel.js'


export const isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
 const authHeader = req?.headers?.authorization;
  const token = req?.cookies?.token || (authHeader && authHeader.split(" ")[1]);
    if(!token){
        return next(new ErrorHandler('Please login to access this resource',400))
    }
    try {
      const decodedData=jwt.verify(token,process.env.JWT_SECRET);

      if(!decodedData){
        return next(new ErrorHandler("Not Authorized",400))
      }
      req.user=await userModel.findById(decodedData.id);
      next();
    } catch (error) {
      return next(new ErrorHandler("Not Authorized",401))
    }
}
)

