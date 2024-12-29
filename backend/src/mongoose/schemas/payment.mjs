import mongoose, { mongo } from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  method: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: ["OVO", "GoPay", "DANA", "PayPal", "Master Card"],
  },
  transactionId: {
    type: mongoose.Schema.Types.String,
    default: null,
    unique: true,
  },
  date: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);
