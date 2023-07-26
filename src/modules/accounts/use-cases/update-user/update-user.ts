import { UsernameAlreadyExistsError } from '@/shared/errors/username-already-exists-error'
import { NewUser, User } from '../../entities/User'
import { type UsersRepository } from '../../repositories/users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { EmailAlreadyExistsError } from '@/shared/errors/email-already-exists-error'

interface UpdateUserRequest {
  user: NewUser
}

interface UpdateUserResponse {
  user: User
}

// @injectable()
export class UpdateUserUseCase {
  constructor(
    // @inject('UsersRepository')
    private usersRepository: UsersRepository,
  ) {}

  async execute({ user }: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { id, bio, email, firstName, imageUrl, links, username } = user

    const userId = id as string

    const isUserExists = await this.usersRepository.findById({ userId })

    if (!isUserExists) {
      throw new SomethingWentWrongError()
    }

    const promises = []

    if (username) {
      const isUsernameExistsPromise = this.usersRepository.findByUsername({
        username,
      })
      promises[0] = isUsernameExistsPromise
    }

    if (email) {
      const isEmailExistsPromise = this.usersRepository.findByEmail({ email })
      promises[1] = isEmailExistsPromise
    }

    const [isUsernameExists, isEmailExists] = await Promise.all(promises)

    if (isUsernameExists && isUserExists.id !== isUsernameExists.id) {
      throw new UsernameAlreadyExistsError()
    }

    if (isEmailExists && isUserExists.id !== isEmailExists.id) {
      throw new EmailAlreadyExistsError()
    }

    const updatedUser = await this.usersRepository.update({
      id,
      bio,
      email,
      firstName,
      imageUrl,
      links,
      username,
    })
    return { user: updatedUser }
  }
}
