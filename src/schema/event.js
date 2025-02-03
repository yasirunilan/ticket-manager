import joi from "joi";

const createEventSchema = joi.object({
  name: joi.string().required(),
  totalTickets: joi.number().positive().required(),
});
const getEventSchema = joi.object({
  eventId: joi.number().integer().required(),
});
export default {
  createEventSchema,
  getEventSchema,
};
