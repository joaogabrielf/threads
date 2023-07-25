import { randomUUID } from 'crypto'
import { findById } from '../../dtos/find-user-by-id-dto'
import { User, NewUser } from '../../entities/User'
import { UsersRepository } from '../users-repository'
import { findByEmail } from '../../dtos/find-user-by-email-dto'
import { findByUsername } from '../../dtos/find-user-by-username-dto'

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = []

  async create(data: NewUser): Promise<User> {
    const { email, firstName, imageUrl, username, bio, id, links } = data
    const user = {
      id: id ?? randomUUID(),
      username,
      email,
      imageUrl,
      firstName,
      bio,
      links,
      updatedAt: new Date(),
      createdAt: new Date(),
    } as User

    this.users.push(user)

    return user
  }

  async update(data: NewUser): Promise<User> {
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

  async findById({ id }: findById): Promise<User | undefined> {
    return this.users.find((user) => user.id === id)
  }

  async findByUsername({
    username,
  }: findByUsername): Promise<User | undefined> {
    return this.users.find((user) => user.username === username)
  }

  async findByEmail({ email }: findByEmail): Promise<User | undefined> {
    return this.users.find((user) => user.email === email)
  }
}
