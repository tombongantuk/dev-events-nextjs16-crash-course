"use client"

import { useState } from 'react'

const BookEvent = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => { 
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 1000); 
  }

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="button-submit">Submit</button>
          </form>
      )}
    </div>
  )
}

export default BookEvent