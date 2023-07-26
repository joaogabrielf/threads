import { randomUUID } from 'node:crypto'
import { CreateThreadDTO } from '../../dtos/create-thread-dto'
import { Thread } from '../../entities/thread'
import { ThreadsRepository } from '../threads-repository'
import { DeleteThreadDTO } from '../../dtos/delete-thread-dto'
import { FindThreadByIdDTO } from '../../dtos/find-thread-by-id-dto'
import { ReplyThreadDTO } from '../../dtos/reply-thread-dto'
import { SetLikesThreadDTO } from '../../dtos/set-likes-thread-dto'

export class InMemoryThreadsRepository implements ThreadsRepository {
  threads: Thread[] = []

  async create({ body, authorId }: CreateThreadDTO): Promise<Thread> {
    const thread = {
      id: randomUUID(),
      body,
      authorId,
      likesCounter: 0,
      createdAt: new Date(),
    }

    this.threads.push(thread)

    return thread
  }

  async delete({ id }: DeleteThreadDTO): Promise<void> {
    const thread = this.threads.find((thread) => thread.id === id)

    if (!thread) {
      return
    }

    thread.deletedAt = new Date()
  }

  async findById({ id }: FindThreadByIdDTO): Promise<Thread | undefined> {
    return this.threads.find((thread) => thread.id === id)
  }

  async reply({ authorId, body, parentId }: ReplyThreadDTO): Promise<Thread> {
    const thread = {
      id: randomUUID(),
      body,
      authorId,
      likesCounter: 0,
      parentId,
      createdAt: new Date(),
    }

    this.threads.push(thread)

    return thread
  }

  async setLikes({ id, likes }: SetLikesThreadDTO): Promise<void> {
    const thread = this.threads.find((thread) => thread.id === id)

    if (!thread) {
      return
    }

    thread.likesCounter = likes
  }
}
