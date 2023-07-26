import { RepostThreadDTO } from '@/modules/threads/dtos/repost-thread-dto'
import { Repost } from '@/modules/threads/entities/repost'
import { RepostsRepository } from '@/modules/threads/repositories/reposts-repository'
import { db } from '@/shared/infra/drizzle/drizzle'
import { reposts } from '@/shared/infra/drizzle/schemas/reposts'
import { and, eq } from 'drizzle-orm'

export class DrizzleRepostsRepository implements RepostsRepository {
  async repost({ threadId, userId }: RepostThreadDTO): Promise<Repost> {
    const [repostedThread] = await db
      .insert(reposts)
      .values({
        threadId,
        userId,
      })
      .returning()

    return repostedThread
  }

  async delete({ threadId, userId }: RepostThreadDTO): Promise<void> {
    await db
      .update(reposts)
      .set({
        deletedAt: new Date(),
      })
      .where(and(eq(reposts.threadId, threadId), eq(reposts.userId, userId)))
      .execute()
  }

  async findRepost({
    threadId,
    userId,
  }: RepostThreadDTO): Promise<Repost | undefined> {
    return await db.query.reposts.findFirst({
      where: (reposts, { eq }) =>
        eq(reposts.threadId, threadId) && eq(reposts.userId, userId),
    })
  }
}
