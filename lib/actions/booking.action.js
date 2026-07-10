'use server'

import connectToDatabase from '../utils/database';
import Booking from '../models/booking.model';

export const createBooking = async ({ eventId, slug, email }) => {
  try {
    await connectToDatabase();
    await Booking.create({ eventId, slug, email })
    return { success: true };
  } catch (error) {
    console.error('create booking failed', error);
    return { success: false, };
  }
}