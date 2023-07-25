import { randomUUID } from 'node:crypto'
import { CreateThreadDTO } from '../../dtos/create-thread-dto'
import { Thread } from '../../entities/thread'
import { ThreadsRepository } from '../threads-repository'
import { DeleteThreadDTO } from '../../dtos/delete-thread-dto'
import { FindThreadByIdDTO } from '../../dtos/find-thread-by-id-dto'

export class InMemoryThreadsRepository implements ThreadsRepository {
  threads: Thread[] = []

  async create({ body, authorId }: CreateThreadDTO): Promise<Thread> {
    const thread = {
      id: randomUUID(),
      body,
      authorId,
      likesCounter: 0,
      createdAt: new Date(),
    } as Thread

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
}
