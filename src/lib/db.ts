import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL || "";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

// Production connection pool options
const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
};

/**
 * Connect to MongoDB Atlas with connection caching and auto-reconnect resilience
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("DB_URL environment variable is missing in .env");
  }

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Setup connection event listeners
    if (mongoose.connection.listenerCount("connected") === 0) {
      mongoose.connection.on("connected", () => {
        console.log("MongoDB connection established successfully");
      });

      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected. Reconnecting...");
      });
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, MONGOOSE_OPTIONS)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("Failed to connect to MongoDB Atlas:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Diagnostic health check for MongoDB
 */
export async function checkDatabaseHealth(): Promise<{
  status: "connected" | "disconnected" | "connecting";
  host?: string;
  latencyMs?: number;
}> {
  try {
    const startTime = Date.now();
    const conn = await connectToDatabase();
    const latencyMs = Date.now() - startTime;
    const state = conn.connection.readyState;

    return {
      status: state === 1 ? "connected" : state === 2 ? "connecting" : "disconnected",
      host: conn.connection.host,
      latencyMs,
    };
  } catch {
    return {
      status: "disconnected",
    };
  }
}

export default connectToDatabase;
