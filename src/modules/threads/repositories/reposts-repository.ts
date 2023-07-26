import { RepostThreadDTO } from '../dtos/repost-thread-dto'
import { Repost } from '../entities/repost'

export interface RepostsRepository {
  repost({ threadId, userId }: RepostThreadDTO): Promise<Repost>
  delete({ threadId, userId }: RepostThreadDTO): Promise<void>
  findRepost({ threadId, userId }: RepostThreadDTO): Promise<Repost | undefined>
}
