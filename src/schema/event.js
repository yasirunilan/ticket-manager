import joi from "joi";

const createEventSchema = joi.object({
  name: joi.string().required(),
  totalTickets: joi.number().positive().required(),
});

export default {
  createEventSchema,
};
