import { findByEmail } from '../dtos/find-user-by-email-dto'
import { findById } from '../dtos/find-user-by-id-dto'
import { findByUsername } from '../dtos/find-user-by-username-dto'
import { User, NewUser } from '../entities/User'

export interface UsersRepository {
  create(data: NewUser): Promise<User>
  update(data: NewUser): Promise<User>
  findById({ id }: findById): Promise<User | undefined>
  findByUsername({ username }: findByUsername): Promise<User | undefined>
  findByEmail({ email }: findByEmail): Promise<User | undefined>
}
