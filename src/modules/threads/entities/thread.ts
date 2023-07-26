export interface Thread {
  id: string
  body: string
  likesCounter: number
  parentId?: string | null
  authorId: string
  createdAt: Date
  deletedAt?: Date | null
}
