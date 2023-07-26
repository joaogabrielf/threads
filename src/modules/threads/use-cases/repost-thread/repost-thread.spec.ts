import { User } from '@/modules/accounts/entities/User'
import { Thread } from '../../entities/thread'
import { RepostThreadUseCase } from './repost-thread'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { ThreadsRepository } from '../../repositories/threads-repository'
import { RepostsRepository } from '../../repositories/reposts-repository'
import { InMemoryUsersRepository } from '@/modules/accounts/repositories/in-memory/in-memory-users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { describe, beforeEach, expect, it } from 'vitest'
import { InMemoryRepostsRepository } from '../../repositories/in-memory/in-memory-reposts-repository'
import { InMemoryThreadsRepository } from '../../repositories/in-memory/in-memory-threads-repository'
import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'

let repostsRepository: RepostsRepository
let threadsRepository: ThreadsRepository
let usersRepository: UsersRepository
let sut: RepostThreadUseCase
let user: User
let thread: Thread

describe('Repost Thread', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    threadsRepository = new InMemoryThreadsRepository()
    repostsRepository = new InMemoryRepostsRepository()
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

    sut = new RepostThreadUseCase(
      threadsRepository,
      usersRepository,
      repostsRepository,
    )
  })

  it('should be able to repost a thread', async () => {
    await sut.execute({
      userId: user.id,
      threadId: thread.id,
    })

    const isThreadReposted = await repostsRepository.findRepost({
      threadId: thread.id,
      userId: user.id,
    })

    expect(isThreadReposted?.threadId).toEqual(thread.id)
    expect(isThreadReposted?.userId).toEqual(user.id)
  })

  it('should not be able to repost a thread with empty userId or threadId', async () => {
    user.id = ''
    thread.id = ''
    await expect(() =>
      sut.execute({
        userId: user.id,
        threadId: thread.id,
      }),
    ).rejects.toThrowError(MissingRequiredFieldsError)
  })

  it('should not be able to repost a thread with a non existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent-user-id',
        threadId: thread.id,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to repost a non existent thread', async () => {
    await expect(() =>
      sut.execute({
        userId: user.id,
        threadId: 'non-existent-thread-id',
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })
})
