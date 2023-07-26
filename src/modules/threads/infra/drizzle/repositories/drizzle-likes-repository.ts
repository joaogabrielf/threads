import { CountLikesDTO } from '@/modules/threads/dtos/count-likes-dto'
import { LikeThreadDTO } from '@/modules/threads/dtos/like-thread-dto'
import { Like } from '@/modules/threads/entities/like'
import { LikesRepository } from '@/modules/threads/repositories/likes-repository'
import { db } from '@/shared/infra/drizzle/drizzle'
import { likes } from '@/shared/infra/drizzle/schemas/likes'
import { and, eq, sql } from 'drizzle-orm'

export class DrizzleLikesRepository implements LikesRepository {
  async like({ threadId, userId }: LikeThreadDTO): Promise<void> {
    await db
      .insert(likes)
      .values({
        threadId,
        userId,
      })
      .execute()
  }

  async dislike({ threadId, userId }: LikeThreadDTO): Promise<void> {
    await db
      .delete(likes)
      .where(and(eq(likes.threadId, threadId), eq(likes.userId, userId)))
      .execute()
  }

  async findLike({
    threadId,
    userId,
  }: LikeThreadDTO): Promise<Like | undefined> {
    const like = await db.query.likes.findFirst({
      where: (likes, { eq }) =>
        and(eq(likes.threadId, threadId), eq(likes.userId, userId)),
    })

    return like
  }

  async countLikes({ threadId }: CountLikesDTO): Promise<number> {
    const [query] = await db
      .select({
        likesCounter: sql<number>`count(${likes.threadId})`.mapWith(Number),
      })
      .from(likes)
      .where(eq(likes.threadId, threadId))

    return query.likesCounter
  }
}
