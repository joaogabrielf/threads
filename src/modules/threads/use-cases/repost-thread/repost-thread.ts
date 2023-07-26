import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { RepostsRepository } from '../../repositories/reposts-repository'
import { ThreadsRepository } from '../../repositories/threads-repository'
import { Repost } from '../../entities/repost'

interface RepostThreadRequest {
  userId: string
  threadId: string
}

interface RepostThreadResponse {
  repost: Repost
}

export class RepostThreadUseCase {
  constructor(
    private threadsRepository: ThreadsRepository,
    private usersRepository: UsersRepository,
    private repostsRepository: RepostsRepository,
  ) {}

  async execute(data: RepostThreadRequest): Promise<RepostThreadResponse> {
    const { threadId, userId } = data

    if (!threadId || !userId) {
      throw new MissingRequiredFieldsError()
    }

    const isUserExistsPromise = this.usersRepository.findById({
      userId,
    })

    const isThreadExistsPromise = this.threadsRepository.findById({
      id: threadId,
    })

    const [isUserExists, isThreadExists] = await Promise.all([
      isUserExistsPromise,
      isThreadExistsPromise,
    ])

    if (!isUserExists || !isThreadExists) {
      throw new SomethingWentWrongError()
    }

    const isThreadAlreadyRepostedByThisUser =
      await this.repostsRepository.findRepost({
        threadId,
        userId,
      })

    if (isThreadAlreadyRepostedByThisUser) {
      throw new SomethingWentWrongError()
    }

    const repost = await this.repostsRepository.repost({
      threadId,
      userId,
    })

    return { repost }
  }
}
