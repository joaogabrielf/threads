import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as follows from './schemas/follows'
import * as users from './schemas/users'
import * as likes from './schemas/likes'
import * as reposts from './schemas/reposts'
import * as threads from './schemas/threads'

import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env.development.local',
})

const url = process.env.PGURL as string

const sql = neon(url)
export const db = drizzle(sql, {
  schema: { ...follows, ...users, ...likes, ...reposts, ...threads },
})
