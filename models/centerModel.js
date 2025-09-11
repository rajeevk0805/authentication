import mongoose from "mongoose";

const centerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    sitting_date: [
      {
        type: Date,
        required: true,
      },
    ],
    sitting_time: {
      type: String,
      required: true,
    },
    maximum_booking: {
      type: Number,
      default: 0,
    },
    booking: {
      booking_date: {
        type: Date,
        default: Date.now(),
        required: true,
      },
      booking_count: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const centerModel = new mongoose.model("center", centerSchema);
