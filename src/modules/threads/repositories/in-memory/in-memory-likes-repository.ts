import { LikeThreadDTO } from '../../dtos/like-thread-dto'
import { Like } from '../../entities/like'
import { LikesRepository } from '../likes-repository'
import { CountLikesDTO } from '../../dtos/count-likes-dto'

export class InMemoryLikesRepository implements LikesRepository {
  likes: Like[] = []

  async like({ threadId, userId }: LikeThreadDTO): Promise<void> {
    this.likes.push({ threadId, userId })
  }

  async dislike({ threadId, userId }: LikeThreadDTO): Promise<void> {
    const likeIndex = this.likes.findIndex(
      (like) => like.threadId === threadId && like.userId === userId,
    )
    this.likes.splice(likeIndex, 1)
  }

  async findLike({
    threadId,
    userId,
  }: LikeThreadDTO): Promise<Like | undefined> {
    return this.likes.find(
      (like) => like.threadId === threadId && like.userId === userId,
    )
  }

  async countLikes({ threadId }: CountLikesDTO): Promise<number> {
    const likesCount = this.likes.filter(
      (like) => like.threadId === threadId,
    ).length

    return likesCount
  }
}
