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
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const payments = await Payment.find().populate("user").populate("course"); // ! .find() bersifat sync, jadi tambahin await

    if (!payments || payments.length === 0)
      return res.status(404).json({ message: "No payments found" });

    res.status(200).json(payments);
  } catch (err) {
    console.log("Error in GET /api/payments route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Create payment
router.post(
  "/",
  checkSchema(createPaymentValidationMethod),
  checkValidation,
  async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const data = matchedData(req);

    try {
      const findCourse = await Course.findById(data.course);
      const user = await User.findById(req.user._id);
      const findPayment = await Payment.find({
        user: user,
        course: findCourse,
      });

      if (!findCourse)
        return res.status(401).json({ error: "Course not found" });

      if (findPayment)
        return res
          .status(400)
          .json({ error: "You already bought this course" });

      if (data.amount !== findCourse.price)
        return res
          .status(400)
          .json({ error: "Payment amount is unsufficient" });

      const newPayment = new Payment({
        user: req.user._id,
        course: findCourse._id,
        amount: data.amount,
        method: data.method,
        transactionId: data.transactionId || null,
        status: "Completed",
      });
      const savedPayment = await newPayment.save();
      user.enrolledCourses.push(data.course);
      await user.save();
      res.status(201).json({
        message: "Payment successfully processed",
        payment: savedPayment,
      });
    } catch (err) {
      console.log("Error in POST /api/payments route:", err);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

export default router;
