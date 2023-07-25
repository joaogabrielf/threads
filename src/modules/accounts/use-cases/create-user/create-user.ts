import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { NewUser, User } from '../../entities/User'
import { type UsersRepository } from '../../repositories/users-repository'
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error'

interface CreateUserRequest {
  user: NewUser
}

interface CreateUserResponse {
  user: User
}

// @injectable()
export class CreateUserUseCase {
  constructor(
    // @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({ user }: CreateUserRequest): Promise<CreateUserResponse> {
    const { bio, email, firstName, id, imageUrl, links, username } = user

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
      bio,
      email,
      firstName,
      id,
      imageUrl,
      links,
      username,
    })
    return { user: newUser }
  }
}
