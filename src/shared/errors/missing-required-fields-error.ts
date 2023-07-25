export class MissingRequiredFieldsError extends Error {
  constructor() {
    super('Missing required fields')
    this.name = 'MissingRequiredFieldsError'
  }
}
