import { DataTypes } from "sequelize";
import sequelize from "../db/database.js";
import { BookingStatus } from "../utils/enums.js";

const WaitingList = sequelize.define(
  "WaitingList",
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
    tableName: "waiting_list",
  }
);
WaitingList.associate = (models) => {
  WaitingList.belongsTo(models.Event, {
    foreignKey: "eventId",
    as: "event",
  });
  WaitingList.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};
export default WaitingList;
