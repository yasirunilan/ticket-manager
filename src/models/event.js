import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id:
 *         - name
 *         - availableTickets
 *         - totalTickets
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         totalTickets:
 *           type: integer
 *           description: The total number of tickets for the event
 *         availableTickets:
 *           type: integer
 *           description: The number of available tickets for the event
 *       example:
 *         id: 1
 *         name: Concert
 *         totalTickets: 100
 *         availableTickets: 100
 */

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    totalTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    availableTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { tableName: "events" }
);
Event.beforeCreate(async (event) => {
  event.availableTickets = event.totalTickets;
});
Event.associate = (models) => {
  Event.hasMany(models.Booking, {
    foreignKey: "eventId",
    as: "bookings",
  });
};
export default Event;
