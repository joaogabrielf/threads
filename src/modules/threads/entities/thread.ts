export interface Thread {
  id: string
  body: string
  likesCounter: number
  parentId?: string
  authorId: string
  createdAt: Date
  deletedAt?: Date
}
