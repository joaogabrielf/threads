import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { threads } from './threads'
import { reposts } from './reposts'
import { likes } from './likes'
import { follows } from './follows'

export const users = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    username: text('username').notNull(),
    email: text('email').notNull(),
    imageUrl: text('image_url').notNull(),
    firstName: text('first_name'),
    bio: text('bio'),
    links: text('links'),
    updatedAt: timestamp('updatedAt').defaultNow().notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (users) => {
    return {
      usernameIdx: uniqueIndex('username_idx').on(users.username),
      emailIdx: uniqueIndex('email_idx').on(users.email),
    }
  },
)

export const usersRelations = relations(users, ({ many }) => ({
  threads: many(threads, {
    relationName: 'userThreads',
  }),
  followers: many(follows, {
    relationName: 'followers',
  }),
  following: many(follows, {
    relationName: 'following',
  }),
  reposts: many(reposts, {
    relationName: 'userReposts',
  }),
  likes: many(likes, {
    relationName: 'userLikes',
  }),
}))
