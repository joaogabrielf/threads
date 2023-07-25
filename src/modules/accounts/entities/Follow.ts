export interface NewFollow {
  followingUserId: string
  followedUserId: string
}

export interface Follow {
  followingUserId: string
  followedUserId: string
  createdAt: Date
}
