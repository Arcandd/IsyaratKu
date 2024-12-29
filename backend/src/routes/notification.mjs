import { Router } from "express";
import { checkSchema, matchedData } from "express-validator";
import { createNotificationValidationSchema } from "../utils/validationSchema/notifValid.mjs";
import { checkValidation } from "../utils/middlewares/checkValidation.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { Notification } from "../mongoose/schemas/notification.mjs";
import formatTimeElapsed from "../utils/helper/calculateTimeElapsed.mjs";

const router = Router();

// ? Memunculkan semua notifikasi dibawah 30 hari
router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const notifications = await Notification.find({
      $or: [{ targetUser: req.user._id }, { targetUser: null }],
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // ? 30 hari yang lalu
    })
      .populate("readBy", "_id, username")
      .sort({ createdAt: -1 });

    if (notifications.length === 0)
      return res.status(404).json({ error: "No notification found" });

    const notificationsWithElapsedTime = notifications.map((notification) => {
      const timeElapsed = Date.now() - notification.createdAt.getTime(); // ? Time in milliseconds

      return {
        ...notification.toObject(),
        timeElapsed: formatTimeElapsed(timeElapsed), // ? A helper function for formatting
      };
    });
    res.status(200).json({ notifications: notificationsWithElapsedTime });
  } catch (err) {
    console.error("Error in GET /api/notifications route:", err);
    res.status(500).json({ error: "Internal Server error" });
  }
});

// ? Membuat notifikasi global / notifikasi spesifik untuk user
router.post(
  "/createNotification",
  checkSchema(createNotificationValidationSchema),
  checkValidation,
  async (req, res) => {
    console.log("Inside create notification api");
    if (!req.user || req.user.role === "user")
      return res.status(401).json({ errors: ["Unauthorized!"] });

    const data = matchedData(req);

    try {
      if (data.targetUser) {
        if (!(await User.findById(data.targetUser)))
          return res.status(404).json({ errors: ["User not found!"] });
      }

      const newNotification = new Notification(data);
      const savedNotification = await newNotification.save();
      res.status(201).json({
        message: "Successfully created a notification",
      });
    } catch (err) {
      console.log(
        "Error in POST /api/notifications/createNotification route:",
        err
      );
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);

// ? Mengupdate status notifikasi ketika user menekan card notifikasi tersebut
router.patch("/:notificationId/read", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const {
    params: { notificationId },
  } = req;

  try {
    const notification = await Notification.findById(notificationId);

    if (!notification)
      return res.status(404).json({ error: "Notification not found" });

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.status(200).json({
      message: "Notification status updated to 'Read'",
      notification,
    });
  } catch (err) {
    console.error(
      "Error in POST /api/notifications/:notificationId/read route:",
      err
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
