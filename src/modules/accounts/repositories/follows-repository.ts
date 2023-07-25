import { FollowUserPairDTO } from '../dtos/follow-user-pair-dto'
import { Follow } from '../entities/Follow'

export interface FollowsRepository {
  follow(data: FollowUserPairDTO): Promise<Follow>
  unfollow(data: FollowUserPairDTO): Promise<void>
  findByUserIds(data: FollowUserPairDTO): Promise<Follow | undefined>
}
