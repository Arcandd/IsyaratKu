import { Router } from "express";
import usersRouter from "./users.mjs";
import authRouter from "./auth.mjs";
import courseRouter from "./course.mjs";
import notificationRouter from "./notification.mjs";
import paymentRouter from "./payment.mjs";
import modelRouter from "./model.mjs";

const router = Router();

router.use("/api/user", usersRouter);
router.use("/api/auth", authRouter);
router.use("/api/courses", courseRouter);
router.use("/api/notifications", notificationRouter);
router.use("/api/payments", paymentRouter);
router.use("/api/model", modelRouter);
// ! router.use(rute baru); jika mau menambahkan rute lagi

export default router;
