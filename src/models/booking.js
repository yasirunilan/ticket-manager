import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";

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
  },
  {
    tableName: "bookings",
    indexes: [{ unique: true, fields: ["userId", "eventId"] }],
  }
);
Booking.associate = (models) => {
  Booking.belongsTo(models.Event, {
    foreignKey: "eventId",
    as: "event",
  });
  Booking.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};
export default Booking;
