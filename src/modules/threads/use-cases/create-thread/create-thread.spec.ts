import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryThreadsRepository } from '../../repositories/in-memory/in-memory-threads-repository'
import { CreateThreadUseCase } from './create-thread'
import { ThreadsRepository } from '../../repositories/threads-repository'
import { InvalidThreadBodyError } from '@/shared/errors/invalid-thread-body-error'
import { NewUser, User } from '@/modules/accounts/entities/User'
import { InMemoryUsersRepository } from '@/modules/accounts/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { NewThread } from '@/shared/infra/drizzle/types/types'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'

let threadsRepository: ThreadsRepository
let usersRepository: UsersRepository
let sut: CreateThreadUseCase
let newUser: NewUser
let user: User

describe('Create Thread', () => {
  beforeEach(async () => {
    newUser = {
      id: 'user-id',
      username: 'user-username',
      email: 'user-email',
      firstName: 'user-firstName',
      imageUrl: 'user-imageUrl',
    } as NewUser
    usersRepository = new InMemoryUsersRepository()
    user = await usersRepository.create(newUser)

    threadsRepository = new InMemoryThreadsRepository()
    sut = new CreateThreadUseCase(threadsRepository, usersRepository)
  })

  it('should be able to create a new thread', async () => {
    const newThread = {
      authorId: user.id,
      body: 'Thread content',
    } as NewThread
    const { thread } = await sut.execute({
      authorId: newThread.authorId,
      body: newThread.body,
    })

    expect(thread.id).toEqual(expect.any(String))
    expect(thread.authorId).toEqual(newThread.authorId)
  })

  it('should not be able to create a new thread with empty body', async () => {
    const newThread = {
      authorId: user.id,
      body: '',
    } as NewThread

    await expect(() =>
      sut.execute({
        authorId: newThread.authorId,
        body: newThread.body,
      }),
    ).rejects.toThrowError(InvalidThreadBodyError)
  })

  it('should not be able to create a new thread with a non existing author', async () => {
    const newThread = {
      authorId: 'non-existent-id',
      body: 'testsetsetse',
    } as NewThread

    await expect(() =>
      sut.execute({
        authorId: newThread.authorId,
        body: newThread.body,
      }),
    ).rejects.toThrowError(SomethingWentWrongError)
  })
})
