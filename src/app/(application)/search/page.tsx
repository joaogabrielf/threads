import { Thread } from '@/components/thread'
import { makeFollowUserUseCase } from '@/shared/factories/make-follow-user-use-case'
import { db } from '@/shared/infra/drizzle/drizzle'

export default async function Search() {
  // const followUserUseCase = makeFollowUserUseCase()
  // await followUserUseCase.execute({
  //   followingUserId: 'user_2T5AGnxn9bx73HLw27wy0IwCfGw',
  //   followedUserId: 'user_2T54qooD4aJA6ES3k5KFicQKiOl',
  // })

  // const user = await db.query.users.findMany({
  //   with: {
  //     followers: {
  //       columns: {
  //         followingUserId: true,
  //       },
  //     },
  //   },
  //   where: (users, { eq }) => eq(users.id, 'user_2T54qooD4aJA6ES3k5KFicQKiOl'),
  // })

  // console.log(user)
  return (
    <>
      <div className="h-full bg-gray-900 pl-5 pr-6 pt-6">
        <Thread />
      </div>
    </>
  )
}
