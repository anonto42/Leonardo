import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { TaskService } from './task.service';

const createTask = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const { id } = req.user
  const { ...verifyData } = req.body;

  verifyData.createdBy = id;
  const result = await TaskService.createTask(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Task created successfully",
    data: result,
  });
});

const allCategoryes = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const { page, limit }: { page?: number, limit?: number} = req.query;

  const result = await TaskService.getCategoryDataForTask(page,limit);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Task created successfully",
    data: result,
  });
});

const getHistoryOfTasks = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const { page, limit, date }: { page?: number, limit?: number, date?: string} = req.query;
  const user = req.user;
  const result = await TaskService.getHistoryData(user,page,limit, date);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get task history!",
    data: result,
  });
});

const deleteTaskController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const { id } = req.params;
  const user = req.user;
  const result = await TaskService.deleteOldTask(user,id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get task history!",
    data: result,
  });
});

const allStrikesTaskController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const { page, limit }: { page?: number, limit?: number } = req.query;
  const user = req.user;
  const result = await TaskService.allStrikedTasks(user,page,limit);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get task history!",
    data: result,
  });
});

export const TaskController = { 
  createTask, allCategoryes, getHistoryOfTasks,
  deleteTaskController, allStrikesTaskController
};