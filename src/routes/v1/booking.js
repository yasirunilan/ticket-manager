import { Router } from "express";
import bookingController from "../../controllers/bookingController.js";
import { validate } from "../../middlewares/validator.js";
import bookingSchema from "../../schema/booking.js";
import authenticate from "../../middlewares/authenticator.js";

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: The bookings managing API
 */
const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingPayload:
 *       type: object
 *       required:
 *         - eventId
 *       properties:
 *         eventId:
 *           type: integer
 *           description: The id of the event
 *       example:
 *         eventId: 1
 *     BookingCancelPayload:
 *       type: object
 *       required:
 *         - bookingId
 *       properties:
 *         bookingId:
 *           type: integer
 *           description: The id of the booking
 *       example:
 *         bookingId: 1
 *     BookingCancelResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Booking Cancelled
 */

/**
 * @swagger
 * /booking/add:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingPayload'
 *     responses:
 *       201:
 *         description: The event booking was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Some server error
 */
router.post(
  "/add",
  validate(bookingSchema.createBookingSchema),
  authenticate("jwt"),
  bookingController.createBooking
);

/**
 * @swagger
 * /booking/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingCancelPayload'
 *     responses:
 *       200:
 *         description: The event booking was successfully cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingCancelResponse'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Some server error
 */
router.post(
  "/cancel",
  validate(bookingSchema.cancelBookingSchema),
  authenticate("jwt"),
  bookingController.cancelBooking
);

export default router;
