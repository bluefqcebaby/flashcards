import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "@/db/schema"

import { env } from "./env"

const globalForDatabase = globalThis as typeof globalThis & {
  flashardsPool?: Pool
}

const pool =
  globalForDatabase.flashardsPool ??
  new Pool({
    connectionString: env.DATABASE_URL,
  })

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.flashardsPool = pool
}

export const db = drizzle(pool, { schema })

export { pool, schema }
