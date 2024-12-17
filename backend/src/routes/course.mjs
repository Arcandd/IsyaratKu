import { Router } from "express";
import { checkSchema, matchedData } from "express-validator";
import {
  addCourseValidationSchema,
  addLessonValidationSchema,
} from "../utils/validationSchema/coursesValid.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";
import { Course, Lesson } from "../mongoose/schemas/course.mjs";

const router = Router();

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
  console.log("Inside search endpoint");
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
// * TODO Tambahin attribut buat foto course
router.post(
  "/addCourse",
  checkSchema(addCourseValidationSchema),
  checkValidation,
  async (req, res) => {
    if (!req.user || req.user.role === "user")
      return res.status(401).json({ error: "Unauthorized" });

    const data = matchedData(req);

    try {
      const newCourse = new Course(data);

      if (
        await Course.findOne({
          title: { $regex: newCourse.title, $options: "i" },
        })
      )
        return res.status(400).json({ error: "Course already exist" });

      const savedCourses = await newCourse.save(); // ! Harus menggunakan await karena save() sifatnya async, tambahkan async di depan (req, res)
      return res.status(201).json(savedCourses);
    } catch (err) {
      console.log("Error in GET /api/courses/addCourse route:", err);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// ? Add lesson
router.post(
  "/addLesson",
  checkSchema(addLessonValidationSchema),
  checkValidation,
  async (req, res) => {
    if (!req.user || req.user.role === "user")
      return res.status(401).json({ error: "Unauthorized" });

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
        return res.status(400).json({ error: "Lesson already exist" });
      if (!findCourse)
        return res.status(404).json({ error: "Course does not exist" });

      const savedLesson = await newLesson.save(); // ! Harus menggunakan await karena save() sifatnya async, tambahkan async di depan (req, res)
      findCourse.lessons.push(savedLesson._id);
      await findCourse.save();
      res.status(201).json(savedLesson);
    } catch (err) {
      console.log("Error in GET /api/courses/addLesson route:", err);
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

    await Course.deleteOne({ _id: findCourseID });

    res
      .status(200)
      .json({ message: `Successfully deleted ${findCourseID.title}` });
  } catch (error) {
    console.log("Error in DELETE /api/courses/deleteCourse/:id route", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ? Menghapus lesson dan juga menghapus id lesson pada dokumen Course
router.delete("/deleteLesson/:id", async (req, res) => {
  if (!req.user || req.user.role === "user")
    return res.status(401).json({ error: "Unauthorized" });

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
