import { DrizzleFollowsRepository } from '@/modules/accounts/infra/drizzle/repositories/drizzle-follows-repository'

export function makeFollowsRepository() {
  const followsRepository = new DrizzleFollowsRepository()

  return followsRepository
}
