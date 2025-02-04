import joi from "joi";

const createBookingSchema = joi.object({
  eventId: joi.number().positive().required(),
});

const cancelBookingSchema = joi.object({
  bookingId: joi.number().positive().required(),
});

export default {
  createBookingSchema,
  cancelBookingSchema,
};
