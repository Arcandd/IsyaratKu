import { Router } from "express";
import { check, checkSchema, matchedData } from "express-validator";
import {
  addCourseValidationSchema,
  addLessonValidationSchema,
} from "../utils/validationSchema/coursesValid.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";
import { Course, Lesson } from "../mongoose/schemas/course.mjs";
import {
  uploadCourseImage,
  uploadLessonVideo,
} from "../utils/helper/azureStorageServices.mjs";
import multer from "multer";
import {
  videoStorage,
  videoFilter,
  courseImageStorage,
  courseImageFileFilter,
} from "../utils/helper/multerConfig.mjs";
import fs from "fs";
import "dotenv/config";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();
const upload = multer({ storage: videoStorage, fileFilter: videoFilter });
const uploadImage = multer({
  storage: courseImageStorage,
  fileFilter: courseImageFileFilter,
});
const account_name = process.env.AZURE_ACCOUNT;

// ? Get all course
router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const courses = await Course.find().populate("lessons"); // ! .find() bersifat sync, jadi tambahin await

    if (!courses || courses.length === 0)
      return res.status(404).json({ error: "No course found" });

    res.status(200).json({ courses: courses });
  } catch (err) {
    console.log("Error in GET /api/courses route", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ? Search courses that contains {title} (ini buat search bar) /search?value=intro to
router.get("/search", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const {
    query: { value },
  } = req;

  try {
    const courses = await Course.find({
      title: { $regex: value, $options: "i" }, // ? "i" itu untuk case insensitive approach, misal input = intro, output = INTRO, Intro, intro, dkk
    }).populate("lessons");

    if (!courses || courses.length === 0)
      return res
        .status(404)
        .json({ error: `There is no course containing ${value}` });

    return res.status(200).json({ courses: courses });
  } catch (err) {
    console.log(`Error in GET /api/courses/search?value=${value} route`, err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ? Get specific course
router.get("/:id", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const {
    params: { id },
  } = req;

  try {
    // ? Find the course by ID and populate the lessons field
    const course = await Course.findById(id).populate("lessons");

    if (!course) return res.status(404).json({ error: "Course not found" });

    // ? Respond with the course including populated lessons
    return res.status(200).json({ course: course });
  } catch (err) {
    console.log("Error in GET /api/courses/:id route", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ? GET lessons from specific course (kalau user mencet course di course page mereka, pake ini)
router.get("/:courseId/lessons", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const {
    params: { courseId },
  } = req;

  try {
    const course = await Course.findById(courseId).populate("lessons");

    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.lessons.length === 0)
      return res.status(404).json({ error: "The course has no lessons" });

    res.status(200).json({
      message: `Displaying the lessons of '${course.title}' course`,
      course: course,
      lessons: course.lessons,
    });
  } catch (err) {
    console.log("Error in GET /api/courses/:courseId/lessons route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Get a specific lesson from a specific course
// * TODO material harus tak ubah jadi url video
router.get("/:courseId/lesson/:lessonId", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const {
    params: { courseId, lessonId },
  } = req;

  try {
    const lesson = await Lesson.findOne({
      $and: [{ _id: lessonId }, { courseId: courseId }],
    }).populate("courseId");

    if (!lesson) return res.status(404).json({ error: "Lesson not found!" });

    res.status(200).json({
      message: `Displaying the lessons of '${lesson.title}' course`,
      lesson: lesson,
    });
  } catch (err) {
    console.log(
      "Error in GET /api/courses/:courseId/lesson/:lessonId route:",
      err
    );
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Add course
router.post(
  "/addCourse",
  uploadImage.single("image"),
  checkSchema(addCourseValidationSchema),
  checkValidation,
  async (req, res) => {
    console.log("Inside add course api");
    if (!req.user || req.user.role === "user")
      return res.status(401).json({ errors: ["Unauthorized"] });

    try {
      const data = matchedData(req);
      const newCourse = new Course(data);

      if (newCourse.type === "Paid" && newCourse.price === 0)
        return res
          .status(400)
          .json({ errors: ["Course price cannot be empty!"] });

      if (
        await Course.findOne({
          title: { $regex: newCourse.title, $options: "i" },
        })
      )
        return res.status(400).json({ errors: ["Course already exist!"] });

      const savedCourse = await newCourse.save(); // ! Harus menggunakan await karena save() sifatnya async, tambahkan async di depan (req, res)

      if (!req.file)
        return res.status(400).json({ errors: ["No file uploaded!"] });

      const imageUrl = await uploadCourseImage(
        savedCourse._id,
        req.file.path,
        req.file.originalname
      );

      if (imageUrl) {
        savedCourse.image = imageUrl;
        await savedCourse.save();
      }

      // ? Menghapus file setelah berhasil di upload ke azure
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file from disk:", err);
        } else {
          console.log("File deleted from disk after upload");
        }
      });

      return res.status(201).json({ message: "Course added succesfully!" });
    } catch (err) {
      console.log("Error in GET /api/courses/addCourse route:", err);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// ? Add lesson
router.post(
  "/addLesson",
  upload.single("material"),
  checkSchema(addLessonValidationSchema),
  checkValidation,
  async (req, res) => {
    if (!req.user || req.user.role === "user")
      return res.status(401).json({ errors: ["Unauthorized"] });

    try {
      const data = matchedData(req);
      const newLesson = new Lesson(data);
      const findCourse = await Course.findById(newLesson.courseId);

      if (
        (await Lesson.findOne({
          title: { $regex: newLesson.title, $options: "i" },
        })) &&
        (await Lesson.findOne({ courseId: newLesson.courseId }))
      )
        return res.status(400).json({ errors: ["Lesson already exist"] });
      if (!findCourse)
        return res.status(404).json({ errors: ["Course does not exist"] });
      if (!req.file)
        return res.status(400).json({ errors: ["No file uploaded."] });

      const savedLesson = await newLesson.save(); // ! Harus menggunakan await karena save() sifatnya async, tambahkan async di depan (req, res)
      findCourse.lessons.push(savedLesson._id);
      await findCourse.save();

      const videoUrl = await uploadLessonVideo(
        data.courseId,
        data.title,
        req.file.path,
        req.file.originalname
      );

      if (videoUrl) {
        savedLesson.material = videoUrl;
        await savedLesson.save();
      }

      // ? Menghapus file setelah berhasil di upload ke azure
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file from disk:", err);
        } else {
          console.log("File deleted from disk after upload");
        }
      });

      res.status(201).json({ message: "Lesson successsfully added" });
    } catch (err) {
      console.log("Error in POST /api/courses/addLesson route:", err);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// ? Delete course
router.delete("/deleteCourse/:id", async (req, res) => {
  if (!req.user || req.user.role === "user")
    return res.status(401).json({ error: "Unauthorized" });

  const {
    params: { id },
  } = req;

  try {
    const findCourseID = await Course.findById({ _id: id });

    if (!findCourseID)
      return res.status(404).json({ error: "Course does not exist" });

    // await deleteBlob("isyaratku/course-videos", id);

    if (findCourseID.lessons.length !== 0)
      await Lesson.deleteMany({ courseId: findCourseID._id });

    await Course.deleteOne({ _id: findCourseID });
    // ? Menghapus course di dalam dokumen User
    await User.updateMany(
      { enrolledCourses: findCourseID._id },
      { $pull: { enrolledCourses: findCourseID._id } }
    );

    res
      .status(200)
      .json({ message: `Successfully deleted ${findCourseID.title}` });
  } catch (err) {
    console.log("Error in DELETE /api/courses/deleteCourse/:id route", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ? Menghapus lesson dan juga menghapus id lesson pada dokumen Course
router.delete("/deleteLesson/:id", async (req, res) => {
  if (!req.user || req.user.role === "user")
    return res.status(401).json({ error: "Unauthorized" });

  console.log('inside delete lesson')

  const {
    params: { id },
  } = req;

  try {
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson)
      return res.status(404).json({ error: "Lesson not found" });

    // ? Remove the lesson reference from any course document
    await Course.updateMany(
      { lessons: id }, // ? Find all courses containing this lesson ID
      { $pull: { lessons: id } } // ? Pull the lesson ID from the 'lessons' array
    );

    return res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    console.log("Error in GET /api/courses/deleteLesson/:id route", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
