import fs from "fs/promises";
import path from "path";
import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import ApiError from "../../errors/ApiError";
import handleValidationError from "../../errors/handleValidationError";
import handleZodError from "../../errors/handleZodError";
import { errorLogger } from "../../shared/logger";
import { IErrorMessage } from "../../types/errors.types";

const globalErrorHandler: ErrorRequestHandler = async (error, req, res, next) => {
  config.node_env === "development"
    ? console.log("🚨 globalErrorHandler ~~ ", error)
    : errorLogger.error("🚨 globalErrorHandler ~~ ", error);

  // 🧹 CLEAN UP: delete uploaded file if an error occurred
  if (req.file) {
    try {
      await fs.unlink(req.file.path);
      console.log(`🗑️ Deleted uploaded file: ${req.file.path}`);
    } catch (unlinkErr) {
      console.error("⚠️ Failed to delete uploaded file:", unlinkErr);
    }
  }

  if (req.files) {
    // if multiple files uploaded
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    for (const file of files) {
      try {
        await fs.unlink(file.path);
        console.log(`🗑️ Deleted uploaded file: ${file.path}`);
      } catch (unlinkErr) {
        console.error("⚠️ Failed to delete uploaded file:", unlinkErr);
      }
    }
  }

  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages: IErrorMessage[] = [];

  if (error.name === "ZodError") {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error.name === "TokenExpiredError") {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Session Expired";
    errorMessages = error?.message
      ? [
          {
            path: "",
            message:
              "Your session has expired. Please log in again to continue.",
          },
        ]
      : [];
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.node_env !== "production" ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
