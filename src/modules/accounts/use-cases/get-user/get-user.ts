import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { type UsersRepository } from '../../repositories/users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { User } from '../../entities/User'

interface GetUserRequest {
  userId: string
}

interface GetUserResponse {
  user: User
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserRequest): Promise<GetUserResponse> {
    if (!userId) {
      throw new MissingRequiredFieldsError()
    }

    const user = await this.usersRepository.getUser({ userId })

    if (!user) {
      throw new SomethingWentWrongError()
    }

    return { user }
  }
}
