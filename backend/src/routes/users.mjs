import { Router } from "express";

import {
  changeEmailValidationSchema,
  changePasswordValidationSchema,
  changeUsernameValidationSchema,
} from "../utils/validationSchema/authValid.mjs";
import { checkSchema, matchedData } from "express-validator";
import { User } from "../mongoose/schemas/user.mjs";
import { Course } from "../mongoose/schemas/course.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";
import {
  comparePassword,
  hashPassword,
} from "../utils/crypting/hashPassword.mjs";
import { enrollCourseValidationSchema } from "../utils/validationSchema/userValid.mjs";
import { Payment } from "../mongoose/schemas/payment.mjs";

const router = Router();

// * TODO buat endpoint untuk POST foto profil

// ? Get all user
router.get("/", async (req, res) => {
  if (!req.user || req.user.role === "user")
    return res.status(401).json({ error: "Unauthorized" });

  const users = await User.find().populate("enrolledCourses");
  res.status(200).json({ users: users });
});

// ? Get user profile
// * TODO tambahin attribut foto profil di GET profile
router.get("/profile", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    return req.user
      ? res.status(200).json({
          user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
          },
        })
      : res.status(401).json({ error: "Unauthorized" });
  } catch (err) {
    console.log("Error in GET /api/user/profile route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? GET enrolled course
router.get("/courses", async (req, res) => {
  // * TODO buat if statement untuk mengecek apakah status course sudah paid
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(req.user._id).populate({
      path: "enrolledCourses",
      populate: {
        path: "lessons",
        model: "Lesson",
      },
    }); // ? Cara agar kita bisa ngepopulate semua attribut yang berhubungan

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.enrolledCourses.length === 0)
      return res
        .status(404)
        .json({ error: "You have not enrolled in any course yet!" });

    res.status(200).json({ enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.log("Error in GET /api/user/course route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Enroll course
router.post(
  "/course/enroll",
  checkSchema(enrollCourseValidationSchema),
  checkValidation,
  async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { courseId } = matchedData(req);

    try {
      const user = await User.findById(req.user._id);
      const course = await Course.findById(courseId);

      if (!user) return res.status(404).json({ error: "User not found" });
      if (!course) return res.status(404).json({ error: "Course not found" });
      // ? Ngecek user sudah bayar apa blom
      if (course.type === "Paid") {
        const payment = await Payment.findOne({
          userId: req.user._id,
          courseId: courseId,
          status: "Completed",
        });

        if (!payment)
          return res
            .status(403)
            .json({ error: "You haven't bought this course yet" });
      }

      const checkAlreadyEnrolled = user.enrolledCourses.some(
        (course) => course._id.toString() === courseId
      );

      if (checkAlreadyEnrolled)
        return res
          .status(400)
          .json({ error: "You have already enrolled in this course" });

      user.enrolledCourses.push(courseId);
      await user.save();

      return res
        .status(200)
        .json({ message: "Successfully enrolled in the course" });
    } catch (err) {
      console.log("Error in POST /api/user/course/enroll route:", err);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// ? Change username
router.patch(
  "/changeUsername",
  checkSchema(changeUsernameValidationSchema),
  checkValidation,
  async (req, res) => {
    try {
      const data = matchedData(req);

      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      // Update the password in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // Find the logged-in user by their ID
        { username: data.newUsername }, // Update only the password field
        { new: true } // Return the updated user document
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Username changed succesfully" });
    } catch (err) {
      console.log("Error in PATCH /api/user/changeUsername route:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ? Change email
router.patch(
  "/changeEmail",
  checkSchema(changeEmailValidationSchema),
  checkValidation,
  async (req, res) => {
    try {
      const data = matchedData(req);

      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      // ? Update the password in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // ? Find the logged-in user by their ID
        { email: data.newEmail }, // ? Update only the password field
        { new: true } // ? Return the updated user document
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Email changed succesfully" });
    } catch (err) {
      console.log("Error in PATCH /api/user/changeEmail route:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ? Change password
router.patch(
  "/changePassword",
  checkSchema(changePasswordValidationSchema),
  checkValidation,
  async (req, res) => {
    try {
      const data = matchedData(req);
      const newPasswordHashed = (data.newPassword = hashPassword(
        data.newPassword
      ));

      if (!req.user) return res.status(401).json({ error: "Unauthorized" });

      if (!comparePassword(data.oldPassword, req.user.password))
        return res.status(400).json({ error: "Invalid credentials" });

      // ? Update the password in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id, // ? Find the logged-in user by their ID
        { password: newPasswordHashed }, // ? Update only the password field
        { new: true } // ? Return the updated user document
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ message: "Password changed succesfully" });
    } catch (err) {
      console.log("Error in PATCH /api/user/changePassword route:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ? Delete account
router.delete("/deleteAccount", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) return res.status(401).json({ error: "User not found" });

    req.logout((err) => {
      if (err) return res.sendStatus(400);
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to destroy session" });
        }

        res.clearCookie("connect.sid");
        return res
          .status(200)
          .json({ message: "User successfully deleted. Logging out." });
      });
    });
  } catch (err) {
    console.log("Error in DELETE /api/user route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
