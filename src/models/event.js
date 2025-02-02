import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

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
  { tableName: "tickets" }
);
Event.associate = (models) => {
  Event.hasMany(models.Booking, {
    foreignKey: "eventId",
    as: "bookings",
  });
};
export default Event;
