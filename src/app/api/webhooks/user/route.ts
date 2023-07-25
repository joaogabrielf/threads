import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/clerk-sdk-node'
import { db } from '@/shared/infra/drizzle/drizzle'
import { users } from '@/shared/infra/drizzle/schemas/users'

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
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 400 },
    )
  }

  if (evt.type === 'user.created' || evt.type === 'user.updated') {
    const {
      id,
      username,
      email_addresses: [{ email_address: email }],
      image_url: imageUrl,
      first_name: firstName,
    } = evt.data

    await db
      .insert(users)
      .values({
        id,
        username: username ?? '',
        email,
        imageUrl,
        firstName: firstName ?? '',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          username: username ?? '',
          email,
          imageUrl,
          firstName: firstName ?? '',
        },
      })
      .returning()
    return NextResponse.json({ message: 'User created' }, { status: 200 })
  }
}

export const POST = handler
