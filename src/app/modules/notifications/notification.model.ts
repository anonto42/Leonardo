import { Model, model, Schema } from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    for: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    from: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    message: { 
      type: String, 
      required: true 
    },
    type:{
      type: String,
      enum: ["coin" , "strick", "strikd-status-change", "task-complete"]
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    readAt: { 
      type: Date, 
      default: null 
    },
  },
  { 
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
);

notificationSchema.index({ for: 1, createdAt: -1 });

export const Notification: Model<INotification> = model<INotification>("Notification",notificationSchema);