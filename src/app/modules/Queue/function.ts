import { Job } from "bullmq";
import { Task } from "../task/task.model";
import { User } from "../user/user.model";
import { Notification } from "../notifications/notification.model";
import { ITask } from "../task/task.interface";
import { messageSend } from "../../../helpers/fireBaseHelper";

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

      const user = await User.findById(task.createdBy);
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

        // Send by Firebase
        await messageSend({
            token: user.fmToken,
            notification:{
                title: `Your ${task.taskName} task have already completed`,
                body: `${ user?.name } your task ${ task.taskName } was complited now.` 
            }
        })

        // Send on Socket
        
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
        );

        // Notification send
        try {

            // Notification created on the DB
            const notification = await Notification.create({
                for: user?._id,
                message: `Your task ${user?.name}'s time up`
            });

            // Send by Firebase
            await messageSend({
                token: user?.fmToken!,
                notification:{
                    title: `${user?.name} your strike was removed`,
                    body: ""
                }
            })

            // Send on Socket

        } catch (error) {
            console.log(error)
        }
    }
}
