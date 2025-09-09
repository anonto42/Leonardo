import { Job } from "bullmq";
import { Task } from "../task/task.model";
import { User } from "../user/user.model";
import { Notification } from "../notifications/notification.model";
import { ITask } from "../task/task.interface";
import { messageSend } from "../../../helpers/fireBaseHelper";
import { RedisDB } from "./redis";
import { io } from "socket.io-client"
import { configDotenv } from "dotenv";
import { Document } from "mongoose";
import { IUser } from "../user/user.interface";

configDotenv({path:"./.env"})

//Socket setup for the update send
const socket = io( `http://${process.env.IP_ADDRESS}:${process.env.PORT}`)
socket.on("connect", () => {
  console.log("Worker connected to Socket.IO server, id:", socket.id);
});

export default async function worker(job: Job) {

    // If this job is for the task status update
    if (job.name === "auto-change-status") {
      const { _id } = job.data;

      const task = await Task.findByIdAndUpdate(
        _id,
        { 
            isComplete: true,
            isInStrick: false
        },
        { new: true }
      ).lean() as ITask;

      const user = await User.findById(task.createdBy) as IUser & Document;
      if (!user) return console.log("User not found");
      user.completedTasks = user.completedTasks + 1;
      await user?.save();

      // Notification send
      try {

        // Notification created on the DB
        await Notification.create({
            for: task?.createdBy,
            message: `Your ${task.taskName} task was completed!`
        });

        // Send on Socket
        const socketId = await RedisDB.get(`user:${user._id}`);
        
        socket.emit("resend", {
            type: "task-complete",
            userId: user?._id,
            message: `Your ${task.taskName} task was completed!`,
            data: {
                socketId,
                taskId: task._id,
                completedAt: new Date()
            }
        });

        // Send by Firebase
        await messageSend({
            token: user.fmToken,
            notification:{
                title: `Your ${task.taskName} task have already completed`,
                body: `${ user?.name } your task ${ task.taskName } was complited now.` 
            }
        })
      } catch (error) {
        console.log(error)
      }
    }

    // IF this job is for user Strick status update
    if (job.name === "user-strik-status-change") {
        const { _id } = job.data;

        const user = await User.findByIdAndUpdate(
            _id,
            {
                "strike.isActive": false,
                "strike.isAddedToStatusUpdateQueue": false
            },
            { new: true }
        ) as IUser;

        // Notification send
        try {

            // Notification created on the DB
            await Notification.create({
                for: user?._id,
                message: `Your task ${user?.name}'s time up`
            });

            // Send on Socket
            const socketId = await RedisDB.get(`user:${user?._id}`);
            
            socket.emit("resend", {
                type: "strikd-status-change",
                userId: user._id,
                message: `${user.name} your strik was removed`,
                data: {
                    socketId,
                    completedAt: new Date()
                }
            });

            // Send by Firebase
            await messageSend({
                token: user?.fmToken!,
                notification:{
                    title: `${user?.name} your strike was removed`,
                    body: `${ user?.name } your account strike was complitedly removed.`
                }
            });

        } catch (error) {
            console.log(error)
        }
    }
}
