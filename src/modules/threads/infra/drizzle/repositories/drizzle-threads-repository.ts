import { CreateThreadDTO } from '@/modules/threads/dtos/create-thread-dto'
import { DeleteThreadDTO } from '@/modules/threads/dtos/delete-thread-dto'
import { FindThreadByIdDTO } from '@/modules/threads/dtos/find-thread-by-id-dto'
import { ReplyThreadDTO } from '@/modules/threads/dtos/reply-thread-dto'
import { SetLikesThreadDTO } from '@/modules/threads/dtos/set-likes-thread-dto'
import { Thread } from '@/modules/threads/entities/thread'
import { ThreadsRepository } from '@/modules/threads/repositories/threads-repository'
import { db } from '@/shared/infra/drizzle/drizzle'
import { threads } from '@/shared/infra/drizzle/schemas/threads'
import { eq } from 'drizzle-orm'

export class DrizzleThreadsRepository implements ThreadsRepository {
  async create(data: CreateThreadDTO): Promise<Thread> {
    const { body, authorId } = data

    const [insertedThread] = await db
      .insert(threads)
      .values({
        body,
        authorId,
      })
      .returning()

    return insertedThread
  }

  async delete({ id }: DeleteThreadDTO): Promise<void> {
    await db
      .update(threads)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(threads.id, id))
      .execute()
  }

  async findById({ id }: FindThreadByIdDTO): Promise<Thread | undefined> {
    const thread = await db.query.threads.findFirst({
      where: (threads, { eq }) => eq(threads.id, id),
    })
    return thread
  }

  async reply({ authorId, body, parentId }: ReplyThreadDTO): Promise<Thread> {
    const [insertedThread] = await db
      .insert(threads)
      .values({
        body,
        authorId,
        parentId,
      })
      .returning()

    return insertedThread
  }

  async setLikes({ id, likes }: SetLikesThreadDTO): Promise<void> {
    await db
      .update(threads)
      .set({ likesCounter: likes })
      .where(eq(threads.id, id))
      .execute()
  }
}
