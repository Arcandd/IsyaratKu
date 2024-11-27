import mongoose, { mongo } from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ["Not Read", "Read"],
      default: "Not Read",
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model("Notification", notificationSchema);
