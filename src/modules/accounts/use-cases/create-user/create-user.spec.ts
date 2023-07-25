import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { NewUser } from '../../entities/User'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { CreateUserUseCase } from './create-user'
import { beforeEach, describe, it, expect } from 'vitest'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

let usersRepository: UsersRepository
let sut: CreateUserUseCase
let newUser: NewUser

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new CreateUserUseCase(usersRepository)

    newUser = {
      id: 'user-id',
      username: 'user-username',
      email: 'user-email',
      firstName: 'user-firstName',
      imageUrl: 'user-imageUrl',
    } as NewUser
  })
  it('should be able to create a new user', async () => {
    const { user } = await sut.execute({
      user: newUser,
    })

    expect(user.id).toEqual(newUser.id)
  })
  it('should not be able to create a new user without username', async () => {
    newUser.username = ''

    await expect(() => sut.execute({ user: newUser })).rejects.toThrowError(
      MissingRequiredFieldsError,
    )
  })

  it('should not be able to create a new user without email', async () => {
    newUser.email = ''

    await expect(() => sut.execute({ user: newUser })).rejects.toThrowError(
      MissingRequiredFieldsError,
    )
  })

  it('should not be able to create a new user without first name', async () => {
    newUser.firstName = ''

    await expect(() => sut.execute({ user: newUser })).rejects.toThrowError(
      MissingRequiredFieldsError,
    )
  })

  it('should not be able to create a new user with existing username', async () => {
    await sut.execute({ user: newUser })

    const newSecondUser = {
      id: 'user-id-second',
      username: 'user-username',
      email: 'user-email-second',
      firstName: 'user-firstName-second',
      imageUrl: 'user-imageUrl-second',
    } as NewUser

    await expect(() =>
      sut.execute({ user: newSecondUser }),
    ).rejects.toThrowError(UserAlreadyExistsError)
  })

  it('should not be able to create a new user with existing email', async () => {
    await sut.execute({ user: newUser })

    const newSecondUser = {
      id: 'user-id-second',
      username: 'user-username-second',
      email: 'user-email',
      firstName: 'user-firstName-second',
      imageUrl: 'user-imageUrl-second',
    } as NewUser

    await expect(() =>
      sut.execute({ user: newSecondUser }),
    ).rejects.toThrowError(UserAlreadyExistsError)
  })
})
