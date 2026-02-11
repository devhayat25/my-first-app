import mongoose, { Connection } from "mongoose";

/**
 * Global variable to cache the Mongoose connection across hot reloads in development.
 * This prevents multiple connections from being established.
 */
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

/**
 * Cached connection object to store the Mongoose connection.
 */
const cached: {
  conn: Connection | null;
  promise: Promise<Connection> | null;
} = global.mongoose || {
  conn: null,
  promise: null,
};

// Assign to global to persist across hot reloads
if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Caches the connection to avoid multiple connections in development.
 *
 * @returns {Promise<Connection>} A promise that resolves to the Mongoose connection.
 * @throws {Error} If the MONGODB_URI environment variable is not set or connection fails.
 */
async function connectToDatabase(): Promise<Connection> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Return cached promise if connection is in progress
  if (cached.promise) {
    return cached.promise;
  }

  // Get MongoDB URI from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  try {
    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      console.log("Connected to MongoDB");
      return mongooseInstance.connection;
    });

    // Await the connection and cache it
    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error) {
    // Reset cached promise on error to allow retries
    cached.promise = null;
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectToDatabase;
