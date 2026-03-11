'use client'

import Link from 'next/link'
import { Menu, X, PencilLineIcon } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navLinks = [
  { href: '/#who-we-are', label: 'Who We Are', exact: false },
  { href: '/#what-we-do', label: 'What We Do', exact: false },
  { href: '/resources', label: 'Resources', exact: false },
  { href: '/newsletters', label: 'Newsletters', exact: false },
  { href: '/gallery', label: 'Gallery', exact: false },
  { href: '/programs', label: 'Programs & Events', exact: false },
]

function useActiveLink() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    // Hash links (/#section) are treated as home-page anchors
    if (href.startsWith('/#')) return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return isActive
}

function NavLink({ href, label, onClick, mobile = false }: Readonly<{ href: string; label: string; onClick?: () => void; mobile?: boolean }>) {
  const isActive = useActiveLink()
  const active = isActive(href)

  const base = mobile
    ? 'px-4 py-3 border-b border-white/20 uppercase tracking-wide transition-colors'
    : 'px-4 py-2 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg'

  const activeClass = active
    ? 'text-white font-semibold underline underline-offset-4 decoration-accent'
    : 'hover:bg-white/10 text-white/90'

  return (
    <Link href={href} onClick={onClick} className={`${base} ${activeClass}`}>
      {label}
    </Link>
  )
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const closeMobile = () => setIsOpen(false)

  return (
    <div className="sticky top-0 z-50">

      {/* Main Header */}
      <header className="bg-white text-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <Image src="/images/kofc-logo.png" alt="Logo" width={100} height={100} />
              </div>
              <div className="flex flex-col">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  Knights of Columbus <br /> Our Lady of the Prairie, Council 5264
                </h1>
                <p className="text-sm md:text-base text-gray-600 italic mt-1">
                  The Knights of Columbus is a parish-oriented fraternal organization of Catholic men in action.
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-linear-to-l from-[#071A4D] to-[#0451A0] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center h-14">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
              <Link
                href="/register"
                className="ml-5 px-4 py-2 border border-accent text-accent font-semibold hover:bg-accent/10 transition-colors text-center rounded-lg"
              >
                Join Us
              </Link>
            </div>
            <div className="ml-4 text-accent/95">
              <Link href="/edit" className="hover:text-white">
                <PencilLineIcon className="size-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 flex flex-col">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} mobile onClick={closeMobile} />
              ))}
              <Link
                href="/register"
                onClick={closeMobile}
                className="px-4 py-3 mt-2 border border-accent text-accent font-semibold hover:bg-accent/10 transition-colors text-center"
              >
                Join Us
              </Link>
              <div className="mt-1 flex text-accent/95 hover:text-white px-4 py-3 hover:bg-white/10 transition-colors border-y border-white/20 uppercase tracking-wide">
                <Link href="/edit" onClick={closeMobile} className="flex flex-row items-center gap-4">
                  <PencilLineIcon className="size-5" /> Edit site
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}