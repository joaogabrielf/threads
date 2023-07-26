import { User } from '../../entities/User'
import { UsersRepository } from '../users-repository'
import { FindByEmailDTO } from '../../dtos/find-user-by-email-dto'
import { FindByIdDTO } from '../../dtos/find-user-by-id-dto'
import { FindByUsernameDTO } from '../../dtos/find-user-by-username-dto'
import { GetUserDTO } from '../../dtos/get-user-dto'
import { CreateUserDTO } from '../../dtos/create-user-dto'
import { UpdateUserDTO } from '../../dtos/update-user-dto'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  async create(data: CreateUserDTO): Promise<User> {
    const { email, firstName, imageUrl, username, bio, id, links } = data
    const user = {
      id,
      username,
      email,
      imageUrl,
      firstName,
      following: [],
      followers: [],
      threads: [],
      bio,
      links,
      updatedAt: new Date(),
      createdAt: new Date(),
    } as User

    this.users.push(user)

    return user
  }

  async update(data: UpdateUserDTO): Promise<User> {
    const { id, email, firstName, imageUrl, username, bio, links } = data
    const user = this.users.find((user) => user.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    user.email = email ?? user.email
    user.firstName = firstName ?? user.firstName
    user.imageUrl = imageUrl ?? user.imageUrl
    user.username = username ?? user.username
    user.bio = bio ?? user.bio
    user.links = links ?? user.links
    user.updatedAt = new Date()

    return user
  }

  async findById({ userId }: FindByIdDTO): Promise<User | undefined> {
    return this.users.find((user) => user.id === userId)
  }

  async findByUsername({
    username,
  }: FindByUsernameDTO): Promise<User | undefined> {
    return this.users.find((user) => user.username === username)
  }

  async findByEmail({ email }: FindByEmailDTO): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }

  async getUser({ userId }: GetUserDTO): Promise<User | undefined> {
    return this.users.find((user) => user.id === userId)
  }
}
