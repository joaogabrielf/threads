import { CountLikesDTO } from '../dtos/count-likes-dto'
import { LikeThreadDTO } from '../dtos/like-thread-dto'
import { Like } from '../entities/like'

export interface LikesRepository {
  like({ threadId, userId }: LikeThreadDTO): Promise<void>
  dislike({ threadId, userId }: LikeThreadDTO): Promise<void>
  findLike({ threadId, userId }: LikeThreadDTO): Promise<Like | undefined>
  countLikes({ threadId }: CountLikesDTO): Promise<number>
}
