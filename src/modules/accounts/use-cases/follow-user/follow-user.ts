import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { type UsersRepository } from '../../repositories/users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { FollowsRepository } from '../../repositories/follows-repository'
import { Follow } from '../../entities/Follow'
import { UserAlreadyFollowingError } from '@/shared/errors/user-already-following-error'

interface FollowUserRequest {
  followingUserId: string
  followedUserId: string
}

interface FollowUserResponse {
  follow: Follow
}

// @injectable()
export class FollowUserUseCase {
  constructor(
    // @inject('UsersRepository')
    private usersRepository: UsersRepository,
    private followsRepository: FollowsRepository,
  ) {}

  async execute({
    followingUserId,
    followedUserId,
  }: FollowUserRequest): Promise<FollowUserResponse> {
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

    if (isFollowExist) {
      throw new UserAlreadyFollowingError()
    }

    const follow = await this.followsRepository.follow({
      followedUserId,
      followingUserId,
    })

    return { follow }
  }
}
