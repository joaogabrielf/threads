import { beforeEach, describe, expect, it } from 'vitest'
import { NewUser, User } from '../../entities/User'
import { UsersRepository } from '../../repositories/users-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { FollowsRepository } from '../../repositories/follows-repository'
import { InMemoryFollowsRepository } from '../../repositories/in-memory/in-memory-follows-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { UnfollowUserUseCase } from './unfollow-user'
import { UserIsNotFollowingError } from '@/shared/errors/user-isnt-following-error'

let usersRepository: UsersRepository
let followsRepository: FollowsRepository
let sut: UnfollowUserUseCase

let newFollowingUser: NewUser
let newFollowedUser: NewUser

let followingUser: User
let followedUser: User

describe('Unfollow User', () => {
  beforeEach(async () => {
    newFollowingUser = {
      id: 'following-user-id',
      username: 'following-user-username-',
      email: 'following-user-email',
      firstName: 'following-user-firstName',
      imageUrl: 'following-user-imageUrl',
    } as NewUser

    newFollowedUser = {
      id: 'followed-user-id',
      username: 'followed-user-username-',
      email: 'followed-user-email',
      firstName: 'followed-user-firstName',
      imageUrl: 'followed-user-imageUrl',
    } as NewUser

    usersRepository = new InMemoryUsersRepository()
    followsRepository = new InMemoryFollowsRepository()

    const followingUserPromise = await usersRepository.create(newFollowingUser)
    const followedUserPromise = await usersRepository.create(newFollowedUser)

    const [followingUserTemp, followedUserTemp] = await Promise.all([
      followingUserPromise,
      followedUserPromise,
    ])

    followingUser = followingUserTemp
    followedUser = followedUserTemp

    await followsRepository.follow({
      followedUserId: followedUser.id,
      followingUserId: followingUser.id,
    })

    sut = new UnfollowUserUseCase(usersRepository, followsRepository)
  })

  it('should be able to unfollow a user', async () => {
    await sut.execute({
      followedUserId: followedUser.id,
      followingUserId: followingUser.id,
    })

    const isFollowExist = await followsRepository.findByUserIds({
      followedUserId: followedUser.id,
      followingUserId: followingUser.id,
    })

    expect(isFollowExist).toBeUndefined()
  })

  it('should not be able to unfollow a user if any of ids is missing', async () => {
    followedUser.id = ''
    followingUser.id = ''

    await expect(
      sut.execute({
        followedUserId: followedUser.id,
        followingUserId: followingUser.id,
      }),
    ).rejects.toThrowError(MissingRequiredFieldsError)
  })

  it('should not be able to unfollow a user if the following user does not exist', async () => {
    const invalidFollowingId = 'non-existing-user-id'

    await expect(
      sut.execute({
        followedUserId: followedUser.id,
        followingUserId: invalidFollowingId,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to unfollow a user if the followed user does not exist', async () => {
    const invalidFollowedId = 'non-existing-user-id'

    await expect(
      sut.execute({
        followedUserId: invalidFollowedId,
        followingUserId: followingUser.id,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to unfollow a user if the user does not follows', async () => {
    await followsRepository.unfollow({
      followedUserId: followedUser.id,
      followingUserId: followingUser.id,
    })

    await expect(
      sut.execute({
        followedUserId: followedUser.id,
        followingUserId: followingUser.id,
      }),
    ).rejects.toThrowError(UserIsNotFollowingError)
  })
})
