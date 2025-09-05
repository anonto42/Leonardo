import { Model, Types } from "mongoose";

export interface INotification {
  for: Types.ObjectId,
  from: Types.ObjectId,
  message: string,
  isRead: boolean,
  readAt: Date,
}

export type NotificationModel = {

} & Model<INotification>;