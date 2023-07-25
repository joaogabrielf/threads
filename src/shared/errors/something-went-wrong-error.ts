export class SomethingWentWrongError extends Error {
  constructor() {
    super('Something went wrong.')
    this.name = 'SomethingWentWrongError'
  }
}
