"use client"

import { useState } from 'react'
import { createBooking } from '@/lib/actions/booking.action'
import { posthog } from "posthog-js";

const BookEvent = ({eventId,slug}) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit =async (e) => {
    e.preventDefault();
    const { success, error } = await createBooking({ eventId, slug, email });
    if (success) {
      setSubmitted(true);
      posthog.capture('event-booked',{eventId,slug,email})
    } else {
      console.error("Booking creation failed", error)
      posthog.captureException("Booking creation failed")
    }
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p role="status" className="text-sm">Thank you for signing up!</p>) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm">Email Address</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />          </div>
          <button type="submit" className="button-submit">Submit</button>
        </form>
      )}
    </div>
  )
}

export default BookEvent