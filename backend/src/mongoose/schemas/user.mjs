import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  role: {
    type: mongoose.Schema.Types.String,
    enum: ["user", "admin"],
    default: "user",
  },
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  profileImage: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
});

export const User = mongoose.model("User", userSchema);
