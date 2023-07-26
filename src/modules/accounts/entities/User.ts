import { Thread } from '@/modules/threads/entities/thread'
import { Follow } from './Follow'

export interface NewUser {
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

export interface UpdateUser {
  id: string
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
  bio?: string | null
  links?: string | null
  following?: Follow[]
  followers?: Follow[]
  threads?: Thread[]
  updatedAt?: Date
  createdAt?: Date
}
