import { FollowUserUseCase } from '@/modules/accounts/use-cases/follow-user/follow-user'
import { makeFollowsRepository } from './make-follows-repository'
import { makeUsersRepository } from './make-users-repository'

export function makeFollowUserUseCase() {
  const followsRepository = makeFollowsRepository()
  const usersRepository = makeUsersRepository()
  const useCase = new FollowUserUseCase(usersRepository, followsRepository)

  return useCase
}
