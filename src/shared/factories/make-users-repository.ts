import { DrizzleUsersRepository } from '@/modules/accounts/infra/drizzle/repositories/drizzle-users-repository'

export function makeUsersRepository() {
  const usersRepository = new DrizzleUsersRepository()

  return usersRepository
}
