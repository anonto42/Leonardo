import { Notification } from "./notification.model";
import { Types } from "mongoose";

const createNotification = async ({
  forUser,
  fromUser,
  type,
  message,
}: {
  forUser: Types.ObjectId;
  fromUser?: Types.ObjectId;
  type: string;
  message: string;
}) => {
  const notification = await Notification.create({
    for: forUser,
    from: fromUser,
    type,
    message,
  });
  return notification;
}

interface NotificationOptions {
  page?: number;
  limit?: number;
}

const getNotifications = async (
  userId: string,
  options: NotificationOptions = {}
) => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ for: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("from", "name email image")
      .lean(),
    Notification.countDocuments({ for: userId, isRead: false }),
  ]);

  return { notifications, unreadCount };
};

const markNotificationsRead = async (
  userId: string,
  ids?: string[]
) => {
  const filter = ids
    ? { for: userId, _id: { $in: ids.map(id => new Types.ObjectId(id)) }, isRead: false }
    : { for: userId, isRead: false };

  const result = await Notification.updateMany(filter, {
    $set: { isRead: true, readAt: new Date( Date.now() ) },
  });

  return result.modifiedCount;
};

export const NotificationServices = {
    getNotifications,
    markNotificationsRead
}