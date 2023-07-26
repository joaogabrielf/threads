import { CreateThreadDTO } from '../dtos/create-thread-dto'
import { DeleteThreadDTO } from '../dtos/delete-thread-dto'
import { FindThreadByIdDTO } from '../dtos/find-thread-by-id-dto'
import { ReplyThreadDTO } from '../dtos/reply-thread-dto'
import { SetLikesThreadDTO } from '../dtos/set-likes-thread-dto'
import { Thread } from '../entities/thread'

export interface ThreadsRepository {
  create(data: CreateThreadDTO): Promise<Thread>
  delete({ id }: DeleteThreadDTO): Promise<void>
  findById({ id }: FindThreadByIdDTO): Promise<Thread | undefined>
  reply(data: ReplyThreadDTO): Promise<Thread>
  setLikes({ id, likes }: SetLikesThreadDTO): Promise<void>
}
