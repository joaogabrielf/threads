import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { User } from '../../entities/User'
import { InMemoryFollowsRepository } from '../../repositories/in-memory/in-memory-follows-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { FollowsRepository } from '../../repositories/follows-repository'
import { Follow } from '../../entities/Follow'
import { GetUserUseCase } from './get-user'
import { ThreadsRepository } from '@/modules/threads/repositories/threads-repository'
import { InMemoryThreadsRepository } from '@/modules/threads/repositories/in-memory/in-memory-threads-repository'
import { Thread } from '@/modules/threads/entities/thread'

let sut: GetUserUseCase
let usersRepository: UsersRepository
let followsRepository: FollowsRepository
let threadsRepository: ThreadsRepository
let user: User
let userTestFirst: User
let userTestTwo: User

describe('Get User', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    followsRepository = new InMemoryFollowsRepository()
    threadsRepository = new InMemoryThreadsRepository()

    const newUser: User = {
      id: 'user-id',
      email: 'user-email',
      firstName: 'user-firstName',
      imageUrl: 'user-imageUrl',
      username: 'user-username',
      followers: [],
      following: [],
    }

    const newUserTestFirst: User = {
      id: 'user-test-first-id',
      email: 'user-test-first-email',
      firstName: 'user-test-first-firstName',
      imageUrl: 'user-test-first-imageUrl',
      username: 'user-test-first-username',
    }

    const newUserTestTwo: User = {
      id: 'user-test-two-id',
      email: 'user-test-two-email',
      firstName: 'user-test-two-firstName',
      imageUrl: 'user-test-two-imageUrl',
      username: 'user-test-two-username',
    }

    const userPromise = usersRepository.create(newUser)
    const userTestFirstPromise = usersRepository.create(newUserTestFirst)
    const userTestSecondPromise = usersRepository.create(newUserTestTwo)

    const users = await Promise.all([
      userPromise,
      userTestFirstPromise,
      userTestSecondPromise,
    ])
    user = users[0]
    userTestFirst = users[1]
    userTestTwo = users[2]

    sut = new GetUserUseCase(usersRepository)
  })

  it('should throw an error if userId is missing', async () => {
    await expect(sut.execute({ userId: '' })).rejects.toThrowError(
      MissingRequiredFieldsError,
    )
  })

  it('should throw an error if user is not found', async () => {
    await expect(
      sut.execute({ userId: 'non-existent-user-id' }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should return the user with followers', async () => {
    const firstUserFollowPromise = followsRepository.follow({
      followedUserId: user.id,
      followingUserId: userTestFirst.id,
    })

    const secondUserFollowPromise = followsRepository.follow({
      followedUserId: user.id,
      followingUserId: userTestTwo.id,
    })

    const follows: Follow[] = await Promise.all([
      firstUserFollowPromise,
      secondUserFollowPromise,
    ])

    user.followers?.push(...follows)

    const { user: userWithFollowers } = await sut.execute({ userId: 'user-id' })

    expect(userWithFollowers.followers).toEqual(follows)
  })

  it('should return the user with followings', async () => {
    const firstUserFollowPromise = followsRepository.follow({
      followingUserId: user.id,
      followedUserId: userTestFirst.id,
    })

    const secondUserFollowPromise = followsRepository.follow({
      followingUserId: user.id,
      followedUserId: userTestTwo.id,
    })

    const follows: Follow[] = await Promise.all([
      firstUserFollowPromise,
      secondUserFollowPromise,
    ])

    user.following?.push(...follows)

    const { user: userWithFollowers } = await sut.execute({ userId: 'user-id' })

    expect(userWithFollowers.following).toEqual(follows)
  })

  it('should be able to return users name, imageUrl, firstName, bio, links', async () => {
    const updateUser = await usersRepository.update({
      id: user.id,
      bio: 'updated-user-bio',
      email: 'updated-user-email',
      firstName: 'updated-user-firstName',
      imageUrl: 'updated-user-imageUrl',
      links: 'updated-user-links',
      username: 'updated-user-username',
    })

    const { user: userUpdated } = await sut.execute({ userId: user.id })

    expect(userUpdated.bio).toEqual(updateUser.bio)
    expect(userUpdated.links).toEqual(updateUser.links)
  })

  it('should be able to return users threads', async () => {
    const newFirstThreadPromise = threadsRepository.create({
      authorId: user.id,
      body: 'first-thread-body',
    })
    const newSecondThreadPromise = threadsRepository.create({
      authorId: user.id,
      body: 'second-thread-body',
    })

    const threads: Thread[] = await Promise.all([
      newFirstThreadPromise,
      newSecondThreadPromise,
    ])

    user.threads?.push(...threads)

    const { user: userWithThreads } = await sut.execute({ userId: user.id })

    expect(userWithThreads.threads).toEqual(threads)
  })
})
