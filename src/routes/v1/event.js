import { Router } from "express";
import eventController from "../../controllers/eventController.js";
import { validate } from "../../middlewares/validator.js";
import eventSchema from "../../schema/event.js";
import authenticate from "../../middlewares/authenticator.js";

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: The events managing API
 */

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateEventPayload:
 *       type: object
 *       required:
 *         - name
 *         - totalTickets
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event
 *         totalTickets:
 *           type: integer
 *           description: The total number of tickets for the event
 *       example:
 *         name: Concert
 *         totalTickets: 100
 */

/**
 * @swagger
 * /events/add:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventPayload'
 *     responses:
 *       201:
 *         description: The event was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       409:
 *         description: Event with the same name already exists
 *       500:
 *         description: Some server error
 */
router.post(
  "/add",
  validate(eventSchema.createEventSchema),
  authenticate("jwt"),
  eventController.createEvent
);

export default router;
