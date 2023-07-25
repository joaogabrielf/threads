import { CreateThreadDTO } from '../dtos/create-thread-dto'
import { DeleteThreadDTO } from '../dtos/delete-thread-dto'
import { FindThreadByIdDTO } from '../dtos/find-thread-by-id-dto'
import { Thread } from '../entities/thread'

export interface ThreadsRepository {
  create(data: CreateThreadDTO): Promise<Thread>
  delete({ id }: DeleteThreadDTO): Promise<void>
  findById({ id }: FindThreadByIdDTO): Promise<Thread | undefined>
}
