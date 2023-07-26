export class UserIsNotFollowingError extends Error {
  constructor() {
    super('User is not following')
    this.name = 'UserIsNotFollowingError'
  }
}
