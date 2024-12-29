import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  image: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  status: {
    type: mongoose.Schema.Types.String,
    enum: ["Has not started", "In Progress", "Completed"],
    default: "Has not started",
  },
  type: {
    type: mongoose.Schema.Types.String,
    enum: ["Free", "Paid"],
    default: "Free",
  },
  price: {
    type: mongoose.Schema.Types.Number,
    default: 0,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

export const Course = mongoose.model("Course", courseSchema);

const lessonsSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  material: {
    type: mongoose.Schema.Types.String,
    default: "",
  },
});

export const Lesson = mongoose.model("Lesson", lessonsSchema);
