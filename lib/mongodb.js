/**
 * lib/mongodb.js
 *
 * Mongoose connection helper for Next.js applications.
 * This module caches the Mongoose connection across module reloads
 * (e.g. during development with hot-reload) to avoid creating
 * multiple connections to MongoDB.
 */

import mongoose from 'mongoose';

// Use the standard MongoDB connection environment variable name.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * When running in development, Next.js may reload modules frequently.
 * We attach a cached object to `globalThis` to preserve the connection
 * across reloads. In production this resolves to a no-op since modules
 * are only loaded once.
 */
let cached = globalThis._mongoose;

if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB using Mongoose and cache the connection.
 *
 * Returns an object with the Mongoose connection and the Mongoose module
 * so callers can access models via `conn.connection.model(...)` if needed.
 */
async function connectToDatabase() {
  if (cached.conn) {
    // If an existing connection is cached, reuse it.
    return cached.conn;
  }

  if (!cached.promise) {
    // Create a promise for the initial connection and cache it.
    const opts = {
      // Recommended options; Mongoose 6+ uses sensible defaults, but
      // keep explicit options for clarity and compatibility.
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        return { conn: mongooseInstance.connection, mongoose: mongooseInstance };
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
