import { FollowUserPairDTO } from '@/modules/accounts/dtos/follow-user-pair-dto'
import { Follow } from '@/modules/accounts/entities/Follow'
import { FollowsRepository } from '@/modules/accounts/repositories/follows-repository'
import { db } from '@/shared/infra/drizzle/drizzle'
import { follows } from '@/shared/infra/drizzle/schemas/follows'
import { and, eq } from 'drizzle-orm'

export class DrizzleFollowsRepository implements FollowsRepository {
  async follow({
    followedUserId,
    followingUserId,
  }: FollowUserPairDTO): Promise<Follow> {
    const [insertedUser] = await db
      .insert(follows)
      .values({
        followedUserId,
        followingUserId,
      })
      .returning()

    return insertedUser
  }

  async unfollow({
    followedUserId,
    followingUserId,
  }: FollowUserPairDTO): Promise<void> {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followedUserId, followedUserId),
          eq(follows.followingUserId, followingUserId),
        ),
      )
  }

  async findByUserIds({
    followedUserId,
    followingUserId,
  }: FollowUserPairDTO): Promise<Follow | undefined> {
    const isFollowExist = await db.query.follows.findFirst({
      where: (follows, { eq }) =>
        and(
          eq(follows.followedUserId, followedUserId),
          eq(follows.followingUserId, followingUserId),
        ),
    })
    return isFollowExist
  }
}
