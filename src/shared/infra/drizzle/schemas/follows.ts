import { InferModel, relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const follows = pgTable(
  'follows',
  {
    followingUserId: text('followingUserId')
      .references(() => users.id)
      .notNull(),
    followedUserId: text('followedUserId')
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (follows) => {
    return {
      uniqueFollow: primaryKey(follows.followingUserId, follows.followedUserId),
    }
  },
)

export const followsRelations = relations(follows, ({ one }) => ({
  followingUser: one(users, {
    relationName: 'following',
    fields: [follows.followingUserId],
    references: [users.id],
  }),
  followedUser: one(users, {
    relationName: 'followers',
    fields: [follows.followedUserId],
    references: [users.id],
  }),
}))

export type Follow = InferModel<typeof follows>
export type NewFollow = InferModel<typeof follows, 'insert'>
