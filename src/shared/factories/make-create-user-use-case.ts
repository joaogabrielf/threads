import { CreateUserUseCase } from '@/modules/accounts/use-cases/create-user/create-user'
import { makeUsersRepository } from './make-users-repository'

export function makeCreateUserUseCase() {
  const usersRepository = makeUsersRepository()
  const useCase = new CreateUserUseCase(usersRepository)

  return useCase
}
