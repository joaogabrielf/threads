import { User } from '@/modules/accounts/entities/User'
import { Thread } from '../../entities/thread'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { ThreadsRepository } from '../../repositories/threads-repository'
import { LikesRepository } from '../../repositories/likes-repository'
import { InMemoryUsersRepository } from '@/modules/accounts/repositories/in-memory/in-memory-users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryLikesRepository } from '../../repositories/in-memory/in-memory-likes-repository'
import { InMemoryThreadsRepository } from '../../repositories/in-memory/in-memory-threads-repository'
import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { DislikeThreadUseCase } from './dislike-thread'

let likesRepository: LikesRepository
let threadsRepository: ThreadsRepository
let usersRepository: UsersRepository
let sut: DislikeThreadUseCase
let user: User
let thread: Thread

describe('Dislike Thread', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    threadsRepository = new InMemoryThreadsRepository()
    likesRepository = new InMemoryLikesRepository()
    const newUser = {
      id: 'user-id',
      username: 'user-username',
      email: 'user-email',
      firstName: 'user-firstName',
      imageUrl: 'user-imageUrl',
    }

    const newThread = {
      body: 'Thread content',
      authorId: newUser.id,
    }

    const userPromise = usersRepository.create(newUser)
    const threadPromise = threadsRepository.create(newThread)

    const result = await Promise.all([userPromise, threadPromise])

    user = result[0]
    thread = result[1]

    await likesRepository.like({ threadId: thread.id, userId: user.id })

    sut = new DislikeThreadUseCase(
      threadsRepository,
      usersRepository,
      likesRepository,
    )
  })

  it('should be able to dislike a thread', async () => {
    await sut.execute({
      userId: user.id,
      threadId: thread.id,
    })

    const isThreadLiked = await likesRepository.findLike({
      threadId: thread.id,
      userId: user.id,
    })

    expect(isThreadLiked).toBeUndefined()
  })

  it('should not be able to dislike a thread with empty userId or threadId', async () => {
    user.id = ''
    thread.id = ''
    await expect(() =>
      sut.execute({
        userId: user.id,
        threadId: thread.id,
      }),
    ).rejects.toThrowError(MissingRequiredFieldsError)
  })

  it('should not be able to dislike a thread with a non existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-user-id',
        threadId: thread.id,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to dislike a non existent thread', async () => {
    await expect(() =>
      sut.execute({
        userId: user.id,
        threadId: 'non-existent-thread-id',
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should decrease likesCounter after a dislike', async () => {
    await sut.execute({
      threadId: thread.id,
      userId: user.id,
    })

    const likedThread = await threadsRepository.findById({ id: thread.id })
    const likesCount = await likesRepository.countLikes({ threadId: thread.id })

    expect(likedThread?.likesCounter).toEqual(likesCount)
  })
})
