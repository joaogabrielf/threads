import { FollowUserPairDTO } from '../../dtos/follow-user-pair-dto'
import { Follow } from '../../entities/Follow'
import { FollowsRepository } from '../follows-repository'

export class InMemoryFollowsRepository implements FollowsRepository {
  private follows: Follow[] = []

  async follow({
    followedUserId,
    followingUserId,
  }: FollowUserPairDTO): Promise<Follow> {
    const follow = {
      followedUserId,
      followingUserId,
      createdAt: new Date(),
    }

    this.follows.push(follow)

    return follow
  }

  async unfollow({
    followedUserId,
    followingUserId,
  }: FollowUserPairDTO): Promise<void> {
    const followIndex = this.follows.findIndex(
      (follow) =>
        follow.followedUserId === followedUserId &&
        follow.followingUserId === followingUserId,
    )
    if (followIndex === -1) {
      throw new Error('Follow not found')
    }
    this.follows.splice(followIndex, 1)
  }

  async findByUserIds({
    followedUserId,
    followingUserId,
  }: FollowUserPairDTO): Promise<Follow | undefined> {
    return this.follows.find(
      (follow) =>
        follow.followedUserId === followedUserId &&
        follow.followingUserId === followingUserId,
    )
  }
}
