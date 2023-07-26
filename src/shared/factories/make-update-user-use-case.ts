import { UpdateUserUseCase } from '@/modules/accounts/use-cases/update-user/update-user'
import { makeUsersRepository } from './make-users-repository'

export function makeUpdateUserUseCase() {
  const usersRepository = makeUsersRepository()
  const useCase = new UpdateUserUseCase(usersRepository)

  return useCase
}
