import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryThreadsRepository } from '../../repositories/in-memory/in-memory-threads-repository'
import { ThreadsRepository } from '../../repositories/threads-repository'
import { InvalidThreadBodyError } from '@/shared/errors/invalid-thread-body-error'
import { User } from '@/modules/accounts/entities/User'
import { InMemoryUsersRepository } from '@/modules/accounts/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { Thread } from '../../entities/thread'
import { ReplyToThreadUseCase } from './reply-thread'

let threadsRepository: ThreadsRepository
let usersRepository: UsersRepository
let sut: ReplyToThreadUseCase
let newUser: User
let user: User
let thread: Thread

describe('Reply To Thread', () => {
  beforeEach(async () => {
    newUser = {
      id: 'user-id',
      username: 'user-username',
      email: 'user-email',
      firstName: 'user-firstName',
      imageUrl: 'user-imageUrl',
    }

    usersRepository = new InMemoryUsersRepository()
    threadsRepository = new InMemoryThreadsRepository()

    const userPromise = usersRepository.create(newUser)
    const threadPromise = threadsRepository.create({
      authorId: newUser.id,
      body: 'Thread content',
    })

    const [createdUser, createdThread] = await Promise.all([
      userPromise,
      threadPromise,
    ])

    user = createdUser
    thread = createdThread

    sut = new ReplyToThreadUseCase(threadsRepository, usersRepository)
  })

  it('should be able to reply to a thread', async () => {
    const newReply = {
      authorId: user.id,
      body: 'Reply content',
      parentId: thread.id,
    }
    const { thread: reply } = await sut.execute({
      authorId: newReply.authorId,
      body: newReply.body,
      parentId: newReply.parentId,
    })

    expect(reply.id).toEqual(expect.any(String))
    expect(reply.authorId).toEqual(newReply.authorId)
    expect(reply.parentId).toEqual(newReply.parentId)
  })

  it('should not be able to reply to a thread with empty body', async () => {
    const newReply = {
      authorId: user.id,
      body: '',
      parentId: thread.id,
    }

    await expect(() =>
      sut.execute({
        authorId: newReply.authorId,
        body: newReply.body,
        parentId: newReply.parentId,
      }),
    ).rejects.toThrowError(InvalidThreadBodyError)
  })

  it('should not be able to reply to a thread with a non existing author', async () => {
    const newReply = {
      authorId: 'non-existent-id',
      body: 'Reply content',
      parentId: thread.id,
    }

    await expect(() =>
      sut.execute({
        authorId: newReply.authorId,
        body: newReply.body,
        parentId: newReply.parentId,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })

  it('should not be able to reply to a non existing thread', async () => {
    const newReply = {
      authorId: user.id,
      body: 'Reply content',
      parentId: 'non-existent-id',
    }

    await expect(() =>
      sut.execute({
        authorId: newReply.authorId,
        body: newReply.body,
        parentId: newReply.parentId,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })
})
