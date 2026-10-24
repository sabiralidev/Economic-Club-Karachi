import "server-only";
import mongoose from "mongoose";
import { getServerEnvironment } from "@/lib/env";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache = globalThis.mongooseCache ?? { connection: null, promise: null, uri: null };
globalThis.mongooseCache = cache;

export async function connectMongo(): Promise<typeof mongoose> {
  let MONGODB_URI: string | undefined;
  try {
    ({ MONGODB_URI } = getServerEnvironment());
  } catch {
    const error = new Error("MongoDB server configuration is invalid.");
    error.name = "DatabaseConfigurationError";
    throw error;
  }
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required to use MongoDB-backed features.");
  }

  if (cache.connection?.connection.readyState === 1 && cache.uri === MONGODB_URI) return cache.connection;
  if (cache.uri && cache.uri !== MONGODB_URI) {
    if (cache.promise) {
      try {
        await cache.promise;
      } catch {
        cache.promise = null;
      }
    }
    await mongoose.disconnect();
  }
  if (cache.connection?.connection.readyState === 0 || cache.uri !== MONGODB_URI) {
    cache.connection = null;
    cache.promise = null;
    cache.uri = null;
  }

  if (!cache.promise) {
    cache.uri = MONGODB_URI;
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5_000,
    }).catch((error: unknown) => {
      cache.promise = null;
      cache.connection = null;
      cache.uri = null;
      throw error;
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
