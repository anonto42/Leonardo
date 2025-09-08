import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ITask } from './task.interface';
import { Task } from './task.model';
import { Category } from '../category/category.model';
import { taskQueue } from '../Queue/taskQueue';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

const createTask = async (
  payload: ITask & { taskWillEnd: Date }
) => {

  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneHowerMs = 1 * 60 * 1000;
  // const oneHowerMs = 24 * 60 * 60 * 1000;
  // const oneMinitMS = 1 * 60 * 1000;

  //Find the category that user selected
  const category = await Category.findById(payload.category);
  if (!category) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      "Please enter a valid category"
    )
  }

  //Find the user who wont to create the task
  const user = await User.findById(payload.createdBy);
  if (!user) {
   throw new ApiError(
    StatusCodes.NOT_FOUND,
    "User not found!"
   ) 
  }

  // Check that is the user has already in strick
  if (user.strike.isActive) { // If the user has the strike 
    
    // First cut 2 extra coin from the user 
    if (category.action == "remove") {
      user.coin = user.coin - ( category.coin + 2 )
      await user.save();
    } else if (category.action == "add") {
      user.coin = user.coin + ( category.coin - 2 )
      await user.save();
    }

    // Create the task
    const createdTask = await Task.create({
      ...payload,
      isInStrick: true
    });
    if (!createdTask) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong while creating the task"
      )
    }

    // Extracting the duration for the MS
    const delay = new Date(payload.taskWillEnd).getTime() - Date.now();

    // Add the auto complite task on Queue to update status
    await taskQueue.add(
      "auto-change-status",
      { _id: createdTask._id },
      { delay }
    )

    // Check that is the oparation added to the Queue for updat the user strick
    if (!user.strike.isAddedToStatusUpdateQueue) {
      await taskQueue.add(
        "user-strik-status-change",
        { _id: user._id },
        { delay: oneHowerMs }
      )
    }

    return {
      message: "Strike Receiced!",
      context: "Extra +2 coins will be deducted for each task in this category."
    }

  } else if (!user.strike.isActive) { // If the user is not on strike
    
    //First check is the Task are exist on same Time Frame then user should take a strike
    const taskFind = await Task.find({
      createdBy: user._id,
      category: category._id,
      selectDate: payload.selectDate,
      isComplete: false
    })

    // If this is more the 5 already then do the strike oparation
    if (taskFind.length > 5) {

      // Changed the active status
      user.strike.isActive = true
      
      // Add on user strick status Queue
      await taskQueue.add(
        "user-strik-status-change",
        { _id: user._id },
        { delay: oneHowerMs }
      )

      // Status updated
      user.strike.isAddedToStatusUpdateQueue = true

      // Save user status
      await user.save()

      // Create the the task with strik 
      // First cut 2 extra coin from the user 
      if (category.action == "remove") {
        user.coin = user.coin - ( category.coin + 2 )
        await user.save();
      } else if (category.action == "add") {
        user.coin = user.coin + ( category.coin - 2 )
        await user.save();
      }

      // Create the task
      const createdTask = await Task.create({
        ...payload,
        isInStrick: true
      });
      if (!createdTask) {
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Something went wrong while creating the task"
        )
      }

      // Extracting the duration for the MS
      const delay = new Date(payload.taskWillEnd).getTime() - Date.now();

      // Add the auto complite task on Queue to update status
      await taskQueue.add(
        "auto-change-status",
        { _id: createdTask._id },
        { delay }
      )

      return {
        message: "Strike Receiced!",
        context: "Extra +2 coins will be deducted for each task in this category."
      }

    }

    // Create task with out the strike
  
    // First action coin from the user 
    if (category.action == "remove") {
      user.coin = user.coin - category.coin
      await user.save();
    } else if (category.action == "add") {
      user.coin = user.coin + category.coin 
      await user.save();
    }

    // Create the task
    const createdTask = await Task.create({
      ...payload,
      isInStrick: false
    });
    if (!createdTask) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Something went wrong while creating the task"
      )
    }
    
    // Extracting the duration for the MS
    const delay = new Date(payload.taskWillEnd).getTime() - Date.now();

    // Add the auto complite task on Queue to update status
    await taskQueue.add(
      "auto-change-status",
      { _id: createdTask._id },
      { delay }
    )

    return "Task complete"

  }
}

const getCategoryDataForTask = async (
  page = 1,
  limit = 10
) => {

  console.log(
    new Date( 
      Date.now() + 4 * 60 * 1000
    )
  )

  return await Category
    .find()
    .select("name action coin")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
}

const getHistoryData = async (
  payload: JwtPayload,
  page: number = 1,
  limit: number = 10
) => {
  const { id } = payload;

  const historyTask = await Task
  .find({
    createdBy: id,
    isComplete: true
  })
  .select("taskName createdAt category")
  .populate({
    path: "category",
    select: "name action image coin -_id"
  })
  .skip(( page - 1) * limit)
  .limit( limit )
  .lean();

  return historyTask;
}

const deleteOldTask = async (
  payload: JwtPayload,
  taskId: string
) => {
  const taskID = new mongoose.Types.ObjectId(taskId);
  const { id } = payload;
  const task = await Task.findById(taskID)
  if (!task) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Task not founded so we unabale to delete this"
    )
  }

  if ( id != task.createdBy.toString()) {
    throw new ApiError(
      StatusCodes.NOT_ACCEPTABLE,
      "You are not allow to delete this task!"
    )
  }
  await task.deleteOne();

  return "Task delete successfully"
}

const allStrikedTasks = async (
  payload: JwtPayload,
  page: number = 1,
  limit: number = 10
) => {
  return await Task
    .find(
      {
        createdBy: new mongoose.Types.ObjectId( payload.id ),
        isInStrick: true
      }
    )
    .select("taskName createdAt category")
    .populate({
      path: "category",
      select: "name action image coin -_id"
    })
    .skip( ( page - 1 ) * limit )
    .limit(limit)
    .lean();
}

export const TaskService = {
  createTask, getCategoryDataForTask, getHistoryData,
  deleteOldTask, allStrikedTasks
};