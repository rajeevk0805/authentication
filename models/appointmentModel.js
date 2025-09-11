import mongoose from "mongoose"

const appointmentSchema=new mongoose.Schema({
  patient_name:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true,
  },
  email:{
    type:String,
    required:true
  },
  center:{
    type:String,
    required:true,
    ref:"center"
  },
  date:{
    type:Date,
    required:true
  }
})

export const appointmentModel=new mongoose.model("appointment",appointmentSchema)