import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-8">
      <Image src="/threads.png" width={500} height={500} alt="threads logo" />
      <SignIn />
    </div>
  )
}
