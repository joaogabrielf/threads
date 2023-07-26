import { Repost } from '../../entities/repost'
import { RepostThreadDTO } from '../../dtos/repost-thread-dto'
import { RepostsRepository } from '../reposts-repository'

export class InMemoryRepostsRepository implements RepostsRepository {
  reposts: Repost[] = []

  async repost({ threadId, userId }: RepostThreadDTO): Promise<Repost> {
    const repost: Repost = {
      threadId,
      userId,
      createdAt: new Date(),
      deletedAt: new Date(),
    }
    this.reposts.push(repost)
    return repost
  }

  async delete({ threadId, userId }: RepostThreadDTO): Promise<void> {
    const repostIndex = this.reposts.findIndex(
      (repost) => repost.threadId === threadId && repost.userId === userId,
    )
    this.reposts.splice(repostIndex, 1)
  }

  async findRepost({
    threadId,
    userId,
  }: RepostThreadDTO): Promise<Repost | undefined> {
    return this.reposts.find(
      (repost) => repost.threadId === threadId && repost.userId === userId,
    )
  }
}
