import mongoose from "mongoose";
import { Notification } from "../../mongoose/schemas/notification.mjs";

// ? Helper function to delete old notifications
const deleteOldNotifications = async () => {
  try {
    const oneDayAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // ? 30 days in milliseconds
    const result = await Notification.deleteMany({
      createdAt: { $lt: oneDayAgo },
    });

    console.log(
      `Deleted ${result.deletedCount} notifications older than 1 day.`
    );
  } catch (err) {
    console.error("Error deleting old notifications:", err);
  }
};

// ? Run the task every day (86400000 ms = 1 day)
setInterval(deleteOldNotifications, 86400000); // ? Check and delete old notifications once a day
