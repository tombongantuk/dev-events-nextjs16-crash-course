import mongoose from 'mongoose';
import Event from './event.model';

const { Schema, model, models } = mongoose;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: 'Email must be valid',
      },
    },
  },
  { timestamps: true, strict: true }
);

BookingSchema.pre('save', async function (next) {
  if (!this.eventId) {
    return next(new Error('eventId is required'));
  }

  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    return next(new Error('Referenced event does not exist'));
  }

  if (!emailRegex.test(this.email)) {
    return next(new Error('Invalid email address'));
  }

  next();
});

const Booking = models.Booking || model('Booking', BookingSchema);
export default Booking;
