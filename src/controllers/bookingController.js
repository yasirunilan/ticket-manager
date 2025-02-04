import bookingService from "../services/bookingService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { StatusCodes } from "http-status-codes";

const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body, req.user);
  res.status(StatusCodes.CREATED).json({ booking });
});

const cancelBooking = asyncHandler(async (req, res) => {
  await bookingService.cancelBooking(req.body, req.user);
  res.status(StatusCodes.OK).json({ message: "Booking Cancelled" });
});

export default {
  createBooking,
  cancelBooking,
};
