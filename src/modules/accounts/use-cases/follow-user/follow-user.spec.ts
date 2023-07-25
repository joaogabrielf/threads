import { beforeEach, describe, expect, it } from 'vitest'
import { NewUser, User } from '../../entities/User'
import { UsersRepository } from '../../repositories/users-repository'
import { FollowUserUseCase } from './follow-user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { FollowsRepository } from '../../repositories/follows-repository'
import { InMemoryFollowsRepository } from '../../repositories/in-memory/in-memory-follows-repository'
import { NewFollow } from '../../entities/Follow'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { UserAlreadyFollowingError } from '@/shared/errors/user-already-following-error'

let usersRepository: UsersRepository
let followsRepository: FollowsRepository
let sut: FollowUserUseCase

let newFollowingUser: NewUser
let newFollowedUser: NewUser

let followingUser: User
let followedUser: User

describe('Follow User', () => {
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

    const followingUserPromise = usersRepository.create(newFollowingUser)
    const followedUserPromise = usersRepository.create(newFollowedUser)

    const [followingUserTemp, followedUserTemp] = await Promise.all([
      followingUserPromise,
      followedUserPromise,
    ])

    followingUser = followingUserTemp
    followedUser = followedUserTemp

    sut = new FollowUserUseCase(usersRepository, followsRepository)
  })

  it('should be able to follow a user', async () => {
    const followUser = {
      followingUserId: followingUser.id,
      followedUserId: followedUser.id,
    } as NewFollow

    const { follow } = await sut.execute({
      followedUserId: followUser.followedUserId,
      followingUserId: followUser.followingUserId,
    })

    expect(follow.followingUserId).toEqual(followUser.followingUserId)
    expect(follow.followedUserId).toEqual(followUser.followedUserId)
  })

  it('should not be able to follow a user if any of ids is missing', async () => {
    const followUser = {
      followingUserId: '',
      followedUserId: '',
    } as NewFollow

    await expect(
      sut.execute({
        followedUserId: followUser.followedUserId,
        followingUserId: followUser.followingUserId,
      }),
    ).rejects.toThrowError(MissingRequiredFieldsError)
  })

  it('should not be able to follow a user if the following user does not exist', async () => {
    const followUser = {
      followingUserId: 'non-existing-user-id',
      followedUserId: followedUser.id,
    } as NewFollow

    await expect(
      sut.execute({
        followedUserId: followUser.followedUserId,
        followingUserId: followUser.followingUserId,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to follow a user if the followed user does not exist', async () => {
    const followUser = {
      followingUserId: followingUser.id,
      followedUserId: 'non-existing-user-id',
    } as NewFollow

    await expect(
      sut.execute({
        followedUserId: followUser.followedUserId,
        followingUserId: followUser.followingUserId,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to follow a user if the user is already following the user', async () => {
    const followUser = {
      followingUserId: followingUser.id,
      followedUserId: followedUser.id,
    } as NewFollow

    await sut.execute({
      followedUserId: followUser.followedUserId,
      followingUserId: followUser.followingUserId,
    })

    await expect(
      sut.execute({
        followedUserId: followUser.followedUserId,
        followingUserId: followUser.followingUserId,
      }),
    ).rejects.toThrowError(UserAlreadyFollowingError)
  })
})
