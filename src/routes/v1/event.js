import { Router } from "express";
import eventController from "../../controllers/eventController.js";
import { validate } from "../../middlewares/validator.js";
import eventSchema from "../../schema/event.js";
import authenticate from "../../middlewares/authenticator.js";

/**
 * @swagger
 * tags:
 *   name: Event
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
 *     EventDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         totalTickets:
 *           type: integer
 *           description: The total number of tickets for the event
 *         availableTickets:
 *           type: integer
 *           description: The total number of available tickets for the event
 *         waitingList:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              eventId:
 *                type: integer
 *              userId:
 *                 type: integer
 *       example:
 *         id: 1
 *         name: Concert
 *         totalTickets: 100
 *         availableTickets: 100
 *         waitingList: [{id: 1, eventId: 1, userId: 1}, {id: 2, eventId: 1, userId: 2}]
 *
 */

/**
 * @swagger
 * /event/add:
 *   post:
 *     summary: Create a new event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
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

// public endpoint
/**
 * @swagger
 * /event/{eventId}:
 *   get:
 *     summary: Get Event Details
 *     tags: [Event]
 *     parameters:
 *      - in: path
 *        name: eventId
 *        required: true
 *        schema:
 *          type: integer
 *        description: The unique identifier of the event
 *     responses:
 *       200:
 *         description: Event fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventDetails'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Some server error
 */
router.get(
  "/:eventId",
  validate(eventSchema.getEventSchema, "params"),
  eventController.getEvent
);

export default router;
