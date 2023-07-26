import { type ThreadsRepository } from '../../repositories/threads-repository'
import { Thread } from '../../entities/thread'
import { InvalidThreadBodyError } from '@/shared/errors/invalid-thread-body-error'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'

interface CreateThreadRequest {
  body: string
  authorId: string
}

interface CreateThreadResponse {
  thread: Thread
}

export class CreateThreadUseCase {
  constructor(
    private threadsRepository: ThreadsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(data: CreateThreadRequest): Promise<CreateThreadResponse> {
    const { body, authorId } = data

    if (!body) {
      throw new InvalidThreadBodyError()
    }

    const isUserExists = await this.usersRepository.findById({
      userId: authorId,
    })

    if (!isUserExists) {
      throw new SomethingWentWrongError()
    }

    const thread = await this.threadsRepository.create({
      authorId,
      body,
    })
    return { thread }
  }
}
