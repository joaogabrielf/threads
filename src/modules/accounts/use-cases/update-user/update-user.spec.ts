import { NewUser, User } from '../../entities/User'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { UpdateUserUseCase } from './update-user'
import { UsernameAlreadyExistsError } from '@/shared/errors/username-already-exists-error'
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error'

let usersRepository: UsersRepository
let sut: UpdateUserUseCase
let newUser: NewUser
let user: User

describe('Update User', () => {
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

    sut = new UpdateUserUseCase(usersRepository)
  })
  it('should be able to update a user', async () => {
    const updatedUser = {
      id: 'user-id',
      username: 'user-username-updated',
      email: 'user-email-updated',
      firstName: 'user-firstName-updated',
      imageUrl: 'user-imageUrl-updated',
    } as NewUser

    await sut.execute({ user: updatedUser })

    expect(user.username).toEqual(updatedUser.username)
  })

  it('should not be able to update a user username to an existing username', async () => {
    const newUserWithExistingUsername = {
      id: 'user-id-new',
      username: 'user-username-new',
      email: 'user-email-new',
      firstName: 'user-firstName-new',
      imageUrl: 'user-imageUrl-new',
    } as NewUser

    const userWithExistingUsername = await usersRepository.create(
      newUserWithExistingUsername,
    )

    userWithExistingUsername.username = user.username

    await expect(() =>
      sut.execute({ user: userWithExistingUsername }),
    ).rejects.toThrowError(UsernameAlreadyExistsError)
  })

  it('should not be able to update a user username to an existing email', async () => {
    const newUserWithExistingEmail = {
      id: 'user-id-new',
      username: 'user-username-new',
      email: 'user-email-new',
      firstName: 'user-firstName-new',
      imageUrl: 'user-imageUrl-new',
    } as NewUser

    const userWithExistingEmail = await usersRepository.create(
      newUserWithExistingEmail,
    )

    userWithExistingEmail.email = user.email

    await expect(() =>
      sut.execute({ user: userWithExistingEmail }),
    ).rejects.toThrowError(EmailAlreadyExistsError)
  })
})
