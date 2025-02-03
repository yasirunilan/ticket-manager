import authService from "../services/authService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { StatusCodes } from "http-status-codes";

const login = asyncHandler(async (req, res) => {
  const token = await authService.login(req.user);
  res.status(StatusCodes.OK).json({ token });
});

export default {
  login,
};
