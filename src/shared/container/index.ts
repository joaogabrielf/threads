import { DrizzleUsersRepository } from '@/modules/accounts/infra/drizzle/repositories/drizzle-users-repository'
import { container } from 'tsyringe'

// container.registerSingleton('ThreadsRepository', ThreadsRepository)

container.registerSingleton('UsersRepository', DrizzleUsersRepository)
