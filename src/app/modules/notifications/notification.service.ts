import { Notification } from "./notification.model";
import mongoose from "mongoose";

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

  //Convert the ids to mongoodb ObjectID
  const objIds = ids?.map( e => new mongoose.Types.ObjectId(e));

  //Update the notifications status to isRead = true
  const result = await Notification.updateMany({
    for: new mongoose.Types.ObjectId(userId),
    _id:{
      $in: objIds
    },
      isRead: false
    }, {
      $set: { isRead: true, readAt: new Date( Date.now() ) },
    }
  );

  //Response the count of updated document
  return { totalUpdated: result.modifiedCount };
};

const deleteNotifications = async (
  userID: string,
  ids: string[]
) => {
  //Convert id't in to mongodb object id 
  const userObjId = new mongoose.Types.ObjectId(userID);
  const notificationsIds = ids.map( e => new mongoose.Types.ObjectId(e));

  //Find and delete 
  const deletedCount = await Notification.deleteMany({
    for: userObjId,
    _id: {
      $in: notificationsIds
    }
  })

  //Return the total deleted count
  return { totalDeleted: deletedCount.deletedCount }
};

export const NotificationServices = {
  getNotifications,
  markNotificationsRead,
  deleteNotifications
}