import Image from 'next/image'
import {
  Heart,
  BadgeCheck,
  MoreHorizontal,
  MessageCircle,
  Send,
  Repeat2,
} from 'lucide-react'

export async function Thread() {
  return (
    <div className="flex gap-5">
      <div className="flex basis-14 flex-col items-center gap-4">
        <div className="w-15 h-15 overflow-hidden rounded-full object-fill">
          <Image src="/photo.png" width={54} height={54} alt="threads logo" />
        </div>
        <div className="h-7 w-1 border-2 border-gray-600"></div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <p className="text-1.5xl">jedinizm</p>
            <BadgeCheck className="fill-blue-600 text-gray-900" />
          </div>
          <div className="flex gap-6">
            <p>12h</p>
            <MoreHorizontal />
          </div>
        </div>
        <div className="mt-2">
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel
            provident iusto dolore. Incidunt eveniet, vel fugit cumque quaerat
            sit harum quae non ut, dolorum eaque illum debitis quisquam? Nobis,
            ratione.
          </p>
        </div>
        <div className="mt-7 flex gap-7">
          <Heart size={26} />
          <MessageCircle size={26} style={{ transform: 'rotateY(180deg)' }} />
          <Repeat2 size={26} />
          <Send size={26} />
        </div>
      </div>
    </div>
  )
}
