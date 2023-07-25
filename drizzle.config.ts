import type { Config } from 'drizzle-kit'

import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env.development.local',
})

export default {
  schema: './src/shared/infra/drizzle/schemas',
  out: './src/shared/infra/drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.PGURL as string,
    ssl: true,
  },
} satisfies Config
