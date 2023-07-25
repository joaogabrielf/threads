import { relations } from 'drizzle-orm'
import { pgTable, text, date, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { threads } from './threads'
import { users } from './users'

export const likes = pgTable(
  'likes',
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
  (like) => {
    return {
      uniqueFollow: primaryKey(like.userId, like.threadId),
    }
  },
)

export const likesRelations = relations(likes, ({ one }) => ({
  author: one(users, {
    relationName: 'userLikes',
    fields: [likes.userId],
    references: [users.id],
  }),
  thread: one(threads, {
    relationName: 'threadLikes',
    fields: [likes.threadId],
    references: [threads.id],
  }),
}))
