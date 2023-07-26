import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { User } from '../../entities/User'
import { type UsersRepository } from '../../repositories/users-repository'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

interface CreateUserRequest {
  id: string
  username: string
  email: string
  imageUrl: string
  firstName: string
}

interface CreateUserResponse {
  user: User
}

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    firstName,
    id,
    imageUrl,
    username,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    if (!username || !email || !firstName) {
      throw new MissingRequiredFieldsError()
    }

    const isUsernameExistsPromise = this.usersRepository.findByUsername({
      username,
    })
    const isEmailExistsPromise = this.usersRepository.findByEmail({ email })

    const [isUsernameExists, isEmailExists] = await Promise.all([
      isUsernameExistsPromise,
      isEmailExistsPromise,
    ])

    if (isUsernameExists || isEmailExists) {
      throw new UserAlreadyExistsError()
    }

    const newUser = await this.usersRepository.create({
      email,
      firstName,
      id,
      imageUrl,
      username,
    })
    return { user: newUser }
  }
}
