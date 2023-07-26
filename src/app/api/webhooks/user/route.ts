import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { makeCreateUserUseCase } from '@/shared/factories/make-create-user-use-case'
import { makeUpdateUserUseCase } from '@/shared/factories/make-update-user-use-case'

const secret = process.env.SVIX_SECRET ?? ''

async function handler(request: Request) {
  const res = await request.json()
  const headersList = headers()

  const svixHeaders = {
    'svix-id': headersList.get('svix-id') ?? '',
    'svix-timestamp': headersList.get('svix-timestamp') ?? '',
    'svix-signature': headersList.get('svix-signature') ?? '',
  }

  const wh = new Webhook(secret)

  let evt: WebhookEvent

  try {
    evt = wh.verify(JSON.stringify(res), svixHeaders) as WebhookEvent
  } catch (e) {
    console.log((e as Error).message)
    return NextResponse.json({ message: (e as Error).message }, { status: 400 })
  }

  switch (evt.type) {
    case 'user.created': {
      const {
        id,
        username,
        email_addresses: [{ email_address: email }],
        image_url: imageUrl,
        first_name: firstName,
      } = evt.data

      const createUserUseCase = makeCreateUserUseCase()

      await createUserUseCase.execute({
        id,
        email,
        firstName,
        username: username ?? '',
        imageUrl,
      })

      return NextResponse.json({ message: 'User created' }, { status: 200 })
    }
    case 'user.updated': {
      const {
        id,
        username,
        email_addresses: [{ email_address: email }],
        image_url: imageUrl,
        first_name: firstName,
      } = evt.data

      const updateUserUseCase = makeUpdateUserUseCase()

      await updateUserUseCase.execute({
        user: {
          id,
          email,
          firstName,
          username: username ?? '',
          imageUrl,
        },
      })

      return NextResponse.json({ message: 'User updated' }, { status: 200 })
    }
    default: {
      return NextResponse.json(
        { message: 'Something went wrong' },
        { status: 400 },
      )
    }
  }
}

export const POST = handler
