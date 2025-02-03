import eventService from "../services/eventService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { StatusCodes } from "http-status-codes";

const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body);
  res.status(StatusCodes.CREATED).json({ event });
});

export default {
  createEvent,
};
