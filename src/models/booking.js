import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";
import { BookingStatus } from "../utils/enums.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - id:
 *         - eventId
 *         - userId
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the event
 *         eventId:
 *           type: integer
 *           description: The Id of the event
 *         userId:
 *           type: integer
 *           description: The Id for the user
 *         status:
 *           type: string
 *           description: The status of the booking either Confirmed or Cancelled
 *       example:
 *         id: 1
 *         eventId: 1
 *         userId: 1
 *         status: 'Confirmed'
 */
const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Events",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    status: {
      type: BookingStatus,
      allowNull: false,
      defaultValue: BookingStatus.CONFIRMED,
    },
  },
  {
    tableName: "bookings",
  }
);
export default Booking;
