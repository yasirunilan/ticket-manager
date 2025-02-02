import { StatusCodes } from "http-status-codes";
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, StatusCodes.BAD_REQUEST);
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

class ForbiddenError extends AppError {
  constructor(message) {
    super(message, StatusCodes.FORBIDDEN);
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
  }
}

export {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
};
