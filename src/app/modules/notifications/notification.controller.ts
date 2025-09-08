import { NextFunction, Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { NotificationServices } from "./notification.service";

const getNotifications = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {

    const pagination = req.query;
    const { id } = req.user

    const result = await NotificationServices.getNotifications(id, pagination );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully get the notifications!',
      data: result,
    });
  }
);

const updateNotificationStatus = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {

    const { id } = req.user
    const ids = req.body.ids

    const result = await NotificationServices.markNotificationsRead(id, ids );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully updated the notifications!',
      data: result,
    });
  }
);

const deleteNotifications = catchAsync(
  async (req: Request | any, res: Response, next: NextFunction) => {

    const { id } = req.user
    const ids = req.body.ids

    const result = await NotificationServices.deleteNotifications(id, ids );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Successfully deleted the notifications!',
      data: result,
    });
  }
);

export const NotificationController = {
  getNotifications,
  updateNotificationStatus,
  deleteNotifications
}