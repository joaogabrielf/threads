export class UsernameAlreadyExistsError extends Error {
  constructor() {
    super('Username already exists')
    this.name = 'UsernameAlreadyExistsError'
  }
}
