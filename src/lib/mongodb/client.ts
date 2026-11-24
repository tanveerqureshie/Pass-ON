import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

if (!uri && process.env.NODE_ENV === 'production') {
  console.warn('Warning: MONGODB_URI is not set in environment variables');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  global._mongoClientPromise = client.connect();
  return global._mongoClientPromise;
}

export async function getDb(dbName = 'PassON'): Promise<Db> {
  const c = await getMongoClientPromise();
  return c.db(dbName);
}
