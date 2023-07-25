export class InvalidThreadBodyError extends Error {
  constructor() {
    super('Invalid thread content, it must not be empty')
    this.name = 'InvalidThreadBodyError'
  }
}
