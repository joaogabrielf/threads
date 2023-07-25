import { Thread } from '@/components/thread'

export default async function Post() {
  return (
    <>
      <div className="h-full bg-gray-900 pl-5 pr-6 pt-6">
        <Thread />
      </div>
    </>
  )
}
