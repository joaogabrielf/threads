export interface NewUser {
  id?: string
  username?: string
  email?: string
  imageUrl?: string
  firstName?: string
  bio?: string
  links?: string
  updatedAt?: Date
  createdAt?: Date
}

export interface User {
  id: string
  username: string
  email: string
  imageUrl: string
  firstName: string
  bio?: string
  links?: string
  updatedAt?: Date
  createdAt?: Date
}
