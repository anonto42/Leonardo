import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const overviewController = catchAsync(async (
  req: Request, 
  res: Response
) => {

  const { chartOfYear }: { chartOfYear?: number} = req.query;
  
  const result = await AdminService.overViewData( chartOfYear );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get overview data!",
    data: result,
  });
})

const getUsersController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { page, limit } = req.query;

  const verifyData = {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  };

  const result = await AdminService.allUsers(verifyData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get all users!",
    data: result,
  });
})

const getUserController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { id } = req.params;

  const user = await AdminService.getUserById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully retrieved user!",
    data: user,
  });
})

const updateUserStatus = catchAsync(async (
  req: Request, 
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await AdminService.updateUserStatus(id, status);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `User status updated to ${status}`,
    data: user,
  });
})

const deleteUserController = catchAsync(async (
  req: Request, 
  res: Response
) => {

  const { id } = req.params;
  
  const user = await AdminService.deleteUser(id);
  
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully deleted user!",
    data: user,
  });
})

const createConditonController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const data = req.body.data;

  const user = await AdminService.conditionCreate(data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfull!",
    data: user,
  });
})

const getConditonController = catchAsync(async (
  req: Request, 
  res: Response
) => {

  const user = await AdminService.getCondition();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get condition!",
    data: user,
  });
})

const createPolicyController = catchAsync(async (
  req: Request, 
  res: Response
) => {
  
  const data = req.body.data;

  const user = await AdminService.policyCreate(data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfull!",
    data: user,
  });
})

const getPolicyontroller = catchAsync(async (
  req: Request, 
  res: Response
) => {

  const user = await AdminService.getPolicy();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Successfully get condition!",
    data: user,
  });
})

export const AdminController = { 
  getUsersController,
  getUserController,
  updateUserStatus,
  deleteUserController,
  createConditonController,
  getConditonController,
  createPolicyController,
  getPolicyontroller,
  overviewController
};