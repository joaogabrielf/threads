export class UserAlreadyFollowingError extends Error {
  constructor() {
    super('User already following')
    this.name = 'UserAlreadyFollowingError'
  }
}
