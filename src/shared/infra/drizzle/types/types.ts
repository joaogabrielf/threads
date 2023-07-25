import { InferModel } from 'drizzle-orm'
import { follows } from '../schemas/follows'
import { users } from '../schemas/users'
import { threads } from '../schemas/threads'
import { likes } from '../schemas/likes'
import { reposts } from '../schemas/reposts'

export type Follow = InferModel<typeof follows>
export type NewFollow = InferModel<typeof follows, 'insert'>

export type User = InferModel<typeof users>
export type NewUser = InferModel<typeof users, 'insert'>

export type Thread = InferModel<typeof threads>
export type NewThread = InferModel<typeof threads, 'insert'>

export type Like = InferModel<typeof likes>
export type NewLike = InferModel<typeof likes, 'insert'>

export type Repost = InferModel<typeof reposts>
export type NewRepost = InferModel<typeof reposts, 'insert'>
