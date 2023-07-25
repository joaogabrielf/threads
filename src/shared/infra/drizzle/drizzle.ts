import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env.development.local',
})

const url = process.env.PGURL as string

const sql = neon(url)
export const db = drizzle(sql)
