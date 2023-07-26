import { ThreadsRepository } from '../../repositories/threads-repository'
import { Thread } from '../../entities/thread'
import { InvalidThreadBodyError } from '@/shared/errors/invalid-thread-body-error'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'

interface ReplyToThreadRequest {
  body: string
  authorId: string
  parentId: string
}

interface ReplyToThreadResponse {
  thread: Thread
}

export class ReplyToThreadUseCase {
  constructor(
    private threadsRepository: ThreadsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(data: ReplyToThreadRequest): Promise<ReplyToThreadResponse> {
    const { body, authorId, parentId } = data

    if (!body) {
      throw new InvalidThreadBodyError()
    }

    const isUserExistsPromise = this.usersRepository.findById({
      userId: authorId,
    })

    const isParentThreadExistsPromise = this.threadsRepository.findById({
      id: parentId,
    })

    const [isUserExists, isParentThreadExists] = await Promise.all([
      isUserExistsPromise,
      isParentThreadExistsPromise,
    ])

    if (!isUserExists || !isParentThreadExists) {
      throw new SomethingWentWrongError()
    }

    const thread = await this.threadsRepository.reply({
      authorId,
      body,
      parentId,
    })

    return { thread }
  }
}
