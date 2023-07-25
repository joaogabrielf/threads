import { relations } from 'drizzle-orm'
import { pgTable, text, date, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { threads } from './threads'
import { users } from './users'

export const reposts = pgTable(
  'reposts',
  {
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    threadId: uuid('thread_id')
      .references(() => threads.id)
      .notNull(),
    deletedAt: date('deleted_at', { mode: 'date' }),
    createdAt: date('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (repost) => {
    return {
      uniqueFollow: primaryKey(repost.userId, repost.threadId),
    }
  },
)

export const repostsRelations = relations(reposts, ({ one }) => ({
  author: one(users, {
    relationName: 'userReposts',
    fields: [reposts.userId],
    references: [users.id],
  }),
  thread: one(threads, {
    relationName: 'threadReposts',
    fields: [reposts.threadId],
    references: [threads.id],
  }),
}))
