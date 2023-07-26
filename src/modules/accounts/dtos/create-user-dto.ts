export interface CreateUserDTO {
  id: string
  username: string
  email: string
  imageUrl: string
  firstName: string
  bio?: string | null
  links?: string | null
  updatedAt?: Date
  createdAt?: Date
}
