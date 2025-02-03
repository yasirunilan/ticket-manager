import { ValidationError } from "../utils/appError.js";

export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
    });
    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      return next(new ValidationError("Validation failed", validationErrors));
    }
    req.validatedData = value;
    next();
  };
};
