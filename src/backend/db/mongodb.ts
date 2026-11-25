import { MongoClient, Db } from 'mongodb';
import { env } from '@/backend/config/env';

if (!env.mongodbUri && env.isProduction) {
  console.warn('Warning: MONGODB_URI is not set in environment variables');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (!env.mongodbUri) {
    return Promise.reject(new Error('MONGODB_URI is not configured in environment variables'));
  }

  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  const client = new MongoClient(env.mongodbUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  global._mongoClientPromise = client.connect();
  return global._mongoClientPromise;
}

export async function getDb(dbName = 'PassON'): Promise<Db> {
  const client = await getMongoClientPromise();
  return client.db(dbName);
}
