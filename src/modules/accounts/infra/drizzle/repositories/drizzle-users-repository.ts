import { CreateUserDTO } from '@/modules/accounts/dtos/create-user-dto'
import { FindByEmailDTO } from '@/modules/accounts/dtos/find-user-by-email-dto'
import { FindByIdDTO } from '@/modules/accounts/dtos/find-user-by-id-dto'
import { FindByUsernameDTO } from '@/modules/accounts/dtos/find-user-by-username-dto'
import { GetUserDTO } from '@/modules/accounts/dtos/get-user-dto'
import { UpdateUserDTO } from '@/modules/accounts/dtos/update-user-dto'
import { User } from '@/modules/accounts/entities/User'
import { UsersRepository } from '@/modules/accounts/repositories/users-repository'
import { db } from '@/shared/infra/drizzle/drizzle'
import { users } from '@/shared/infra/drizzle/schemas/users'
import { eq } from 'drizzle-orm'

export class DrizzleUsersRepository implements UsersRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const { id, username, email, firstName, imageUrl, bio, links } = data

    const [insertedUser] = await db
      .insert(users)
      .values({
        id,
        username,
        email,
        firstName,
        imageUrl,
        bio,
        links,
      })
      .returning()

    return insertedUser
  }

  async update(data: UpdateUserDTO): Promise<User> {
    const { id } = data

    const filteredData = { ...data }

    Object.keys(filteredData).forEach(
      (key) =>
        filteredData[key as keyof UpdateUserDTO] === undefined &&
        delete filteredData[key as keyof UpdateUserDTO],
    )

    const [updatedUser] = await db
      .update(users)
      .set(filteredData)
      .where(eq(users.id, id))
      .returning()

    return updatedUser
  }

  async findById({ userId }: FindByIdDTO): Promise<User | undefined> {
    const isUserExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
    })
    return isUserExists
  }

  async findByUsername({
    username,
  }: FindByUsernameDTO): Promise<User | undefined> {
    const isUserExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, username),
    })
    return isUserExists
  }

  async findByEmail({ email }: FindByEmailDTO): Promise<User | undefined> {
    const isUserExists = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })
    return isUserExists
  }

  async getUser({ userId }: GetUserDTO): Promise<User | undefined> {
    const user = await db.query.users.findFirst({
      with: {
        followers: true,
        following: true,
        threads: true,
        reposts: true,
      },
      where: (users, { eq }) => eq(users.id, userId),
    })

    return user
  }
}
