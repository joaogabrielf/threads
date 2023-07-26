import { CreateUserDTO } from '../dtos/create-user-dto'
import { FindByEmailDTO } from '../dtos/find-user-by-email-dto'
import { FindByIdDTO } from '../dtos/find-user-by-id-dto'
import { FindByUsernameDTO } from '../dtos/find-user-by-username-dto'
import { GetUserDTO } from '../dtos/get-user-dto'
import { UpdateUserDTO } from '../dtos/update-user-dto'
import { User } from '../entities/User'

export interface UsersRepository {
  create(data: CreateUserDTO): Promise<User>
  update(data: UpdateUserDTO): Promise<User>
  findById({ userId }: FindByIdDTO): Promise<User | undefined>
  findByUsername({ username }: FindByUsernameDTO): Promise<User | undefined>
  findByEmail({ email }: FindByEmailDTO): Promise<User | undefined>
  getUser({ userId }: GetUserDTO): Promise<User | undefined>
}
