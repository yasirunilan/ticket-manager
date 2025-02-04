import { StatusCodes, ReasonPhrases } from "http-status-codes";
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
} from "../utils/appError.js";
import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    message = err.errors || "Validation Failed";
  } else if (err instanceof AuthenticationError) {
    statusCode = err.statusCode;
    message = err.message || "Authentication Failed";
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode;
    message = err.message || "Resource Not Found";
  }

  logger.error(err.stack);

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { errorHandler, asyncHandler };
