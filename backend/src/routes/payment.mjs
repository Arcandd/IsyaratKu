import { Router } from "express";
import { checkSchema, matchedData } from "express-validator";
import { createPaymentValidationMethod } from "../utils/validationSchema/paymentValid.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";
import { Payment } from "../mongoose/schemas/payment.mjs";
import { Course } from "../mongoose/schemas/course.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

// ? Get all payment
router.get("/", async (req, res) => {
  if (!req.user || req.user.role === "user")
    return res.status(401).json({ error: "Unauthorized" });

  try {
    const payments = await Payment.find()
      .populate("userId")
      .populate("courseId"); // ! .find() bersifat sync, jadi tambahin await

    if (!payments || payments.length === 0)
      return res.status(404).json({ error: "No payments found" });

    res.status(200).json({ payments: payments });
  } catch (err) {
    console.log("Error in GET /api/payments route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Get payment history
router.get("/history", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("userId", "_id, username")
      .populate("courseId", "_id, title");

    if (!payments || payments.length === 0)
      return res.status(404).json({ error: "You have no payment history" });

    res.status(200).json({ payments: payments });
  } catch (err) {
    console.log("Error in GET /api/payments/history route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Create payment
router.post(
  "/createPayment",
  checkSchema(createPaymentValidationMethod),
  checkValidation,
  async (req, res) => {
    if (!req.user) return res.status(401).json({ errors: ["Unauthorized"] });

    const data = matchedData(req);

    try {
      const findCourse = await Course.findById(data.courseId);
      const user = await User.findById(req.user._id);
      const findPayment = await Payment.findOne({
        userId: user,
        courseId: findCourse,
      });

      if (!findCourse)
        return res.status(401).json({ errors: ["Course not found"] });

      if (findCourse.type === "Free")
        return res.status(400).json({ errors: ["This course is free"] });

      if (findPayment)
        return res
          .status(400)
          .json({ errors: ["You already bought this course"] });

      if (data.amount !== findCourse.price)
        return res
          .status(400)
          .json({ errors: ["Payment amount is unsufficient"] });

      const newPayment = new Payment({
        userId: req.user._id,
        courseId: findCourse._id,
        amount: data.amount,
        method: data.method,
        transactionId:
          data.transactionId || `${req.user._id}_${findCourse._id}`,
        status: "Completed",
      });
      const savedPayment = await newPayment.save();
      user.enrolledCourses.push(newPayment.courseId);
      await user.save();
      res.status(201).json({
        message: "Payment successfully processed",
        payment: savedPayment,
      });
    } catch (err) {
      console.log("Error in POST /api/payments route:", err);
      res.status(500).json({ errors: ["Internal Server error"] });
    }
  }
);

export default router;
