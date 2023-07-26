'use client'

import { Heart, Home, PenSquare, Search, User2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cloneElement } from 'react'

export function NavBar() {
  const pathname = usePathname()

  const navElements = [
    { id: 1, href: '/home', icon: <Home /> },
    { id: 2, href: '/search', icon: <Search /> },
    { id: 3, href: '/post', icon: <PenSquare /> },
    { id: 4, href: '/notifications', icon: <Heart /> },
    { id: 5, href: '/profile', icon: <User2 /> },
  ]

  return (
    <nav className="basis-10 bg-inherit py-6">
      <ul className="flex justify-center gap-[72px]">
        {navElements.map((element) => (
          <li key={element.id}>
            <Link href={element.href}>
              {cloneElement(element.icon, {
                size: 36,
                className:
                  pathname === element.href
                    ? 'text-gray-50 fill-gray-50'
                    : 'text-gray-500',
              })}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
