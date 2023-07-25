import { relations } from 'drizzle-orm'
import {
  AnyPgColumn,
  date,
  integer,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'
import { likes } from './likes'
import { reposts } from './reposts'

export const threads = pgTable('threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  body: text('body').notNull(),
  likesCounter: integer('likes_counter').default(0).notNull(),
  parentId: uuid('parent_id').references((): AnyPgColumn => threads.id),
  authorId: text('author_id')
    .references(() => users.id)
    .notNull(),
  deletedAt: date('deleted_at', { mode: 'date' }),
  createdAt: date('created_at', { mode: 'date' }).defaultNow().notNull(),
})

export const threadsRelations = relations(threads, ({ one, many }) => ({
  author: one(users, {
    relationName: 'userThreads',
    fields: [threads.authorId],
    references: [users.id],
  }),
  replies: many(threads, {
    relationName: 'replies',
  }),
  parent: one(threads, {
    relationName: 'replies',
    fields: [threads.parentId],
    references: [threads.id],
  }),
  likes: many(likes, {
    relationName: 'threadLikes',
  }),
  reposts: many(reposts, {
    relationName: 'threadReposts',
  }),
}))
