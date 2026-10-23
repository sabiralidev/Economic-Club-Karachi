import "server-only";
import mongoose from "mongoose";
import { getServerEnvironment } from "@/lib/env";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache = globalThis.mongooseCache ?? { connection: null, promise: null };
globalThis.mongooseCache = cache;

export async function connectMongo(): Promise<typeof mongoose> {
  if (cache.connection?.connection.readyState === 1) return cache.connection;
  if (cache.connection?.connection.readyState === 0) {
    cache.connection = null;
    cache.promise = null;
  }

  const { MONGODB_URI } = getServerEnvironment();
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required to use MongoDB-backed features.");
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).catch((error: unknown) => {
      cache.promise = null;
      cache.connection = null;
      throw error;
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}
