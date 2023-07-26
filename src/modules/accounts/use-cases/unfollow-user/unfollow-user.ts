import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { UsersRepository } from '../../repositories/users-repository'
import { FollowsRepository } from '../../repositories/follows-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { UserIsNotFollowingError } from '@/shared/errors/user-isnt-following-error'

interface UnfollowUserRequest {
  followingUserId: string
  followedUserId: string
}

// @injectable()
export class UnfollowUserUseCase {
  constructor(
    // @inject('UsersRepository')
    private usersRepository: UsersRepository,
    private followsRepository: FollowsRepository,
  ) {}

  async execute({
    followingUserId,
    followedUserId,
  }: UnfollowUserRequest): Promise<void> {
    if (!followingUserId || !followedUserId) {
      throw new MissingRequiredFieldsError()
    }

    const isFollowingUserExistPromise = this.usersRepository.findById({
      userId: followingUserId,
    })
    const isFollowedUserExistPromise = this.usersRepository.findById({
      userId: followedUserId,
    })

    const [isFollowingUserExist, isFollowedUserExist] = await Promise.all([
      isFollowingUserExistPromise,
      isFollowedUserExistPromise,
    ])

    if (!isFollowingUserExist || !isFollowedUserExist) {
      throw new SomethingWentWrongError()
    }

    const isFollowExist = await this.followsRepository.findByUserIds({
      followedUserId,
      followingUserId,
    })

    if (!isFollowExist) {
      throw new UserIsNotFollowingError()
    }

    await this.followsRepository.unfollow({
      followedUserId,
      followingUserId,
    })
  }
}
