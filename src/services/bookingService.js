import { NotFoundError } from "../utils/appError.js";
import sequelize from "../db/database.js";
import Booking from "../models/booking.js";
import Event from "../models/event.js";
import WaitingList from "../models/waitingList.js";
import { BookingStatus } from "../utils/enums.js";

export class BookingService {
  async createBooking(payload, loggedInUser) {
    const { eventId } = payload;
    const userId = loggedInUser.id;
    // start transaction
    const transaction = await sequelize.transaction();
    try {
      const event = await Event.findByPk(eventId, { transaction });
    
      if (!event) {
        throw new NotFoundError("Event not found");
      }
      if (event.availableTickets > 0) {
        const booking = await Booking.create(
          { userId, eventId },
          { transaction }
        );
        await event.decrement("availableTickets", { transaction });
        // commit the transaction
        await transaction.commit();
        return booking;
      } else {
        const waitingListEntry = await WaitingList.create(
          { userId, eventId },
          { transaction }
        );
        // commit the transaction
        await transaction.commit();
        return {
          message: "No tickets available, added to waiting list",
          waitingListEntry,
        };
      }
    } catch (err) {
      // rollback the transaction
      await transaction.rollback();
      throw err;
    }
  }

  async cancelBooking(payload, loggedInUser) {
    const { bookingId } = payload;
    const userId = loggedInUser.id;
    // start the transaction
    const transaction = await sequelize.transaction();

    try {
      const booking = await Booking.findOne({where: {id: bookingId, userId}}, { transaction });

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      const event = await Event.findByPk(booking.eventId, { transaction });

      booking.status = BookingStatus.CANCELLED;
      await booking.save({ transaction });

      const waitingListEntry = await WaitingList.findOne({
        where: { eventId: event.id },
        order: [["createdAt", "ASC"]],
        transaction,
      });

      if (waitingListEntry) {
        await Booking.create(
          { userId: waitingListEntry.userId, eventId: event.id },
          { transaction }
        );
        await waitingListEntry.destroy({ transaction });
      } else {
        event.availableTickets += 1;
        await event.save({ transaction });
      }
      // commit the transaction
      await transaction.commit();
    } catch (error) {
      // rollback the transaction
      await transaction.rollback();
      throw error;
    }
  }
}

export default new BookingService();
