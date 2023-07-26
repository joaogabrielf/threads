import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { MissingRequiredFieldsError } from '@/shared/errors/missing-required-fields-error'
import { SomethingWentWrongError } from '@/shared/errors/something-went-wrong-error'
import { LikesRepository } from '../../repositories/likes-repository'
import { ThreadsRepository } from '../../repositories/threads-repository'

interface DislikeThreadRequest {
  userId: string
  threadId: string
}
export class DislikeThreadUseCase {
  constructor(
    private threadsRepository: ThreadsRepository,
    private usersRepository: UsersRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(data: DislikeThreadRequest): Promise<void> {
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

    const isThreadLiked = await this.likesRepository.findLike({
      threadId,
      userId,
    })

    if (!isThreadLiked) {
      throw new SomethingWentWrongError()
    }

    await this.likesRepository.dislike({
      threadId,
      userId,
    })

    const likesCount = await this.likesRepository.countLikes({
      threadId,
    })

    await this.threadsRepository.setLikes({ id: threadId, likes: likesCount })
  }
}
