'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X, PencilLineIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface NavPage {
  name:  string
  slug:  string
  navbar: boolean
}

function slugToHref(slug: string): string {
  return `/${slug}`
}

function useIsActive() {
  const pathname = usePathname()
  return (href: string) => {
    if (href.startsWith('/#')) return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }
}

interface NavLinkProps {
  href:    string
  label:   string
  mobile?: boolean
  onClick?: () => void
}

function NavLink({ href, label, mobile = false, onClick }: Readonly<NavLinkProps>) {
  const isActive = useIsActive()
  const active   = isActive(href)

  const base = mobile
    ? 'px-4 py-3 border-b border-white/20 uppercase tracking-wide transition-colors'
    : 'px-4 py-2 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg'

  const state = active
    ? 'text-white font-semibold underline underline-offset-4 decoration-accent'
    : 'text-white/90 hover:bg-white/10'

  return (
    <Link href={href} onClick={onClick} className={`${base} ${state}`}>
      {label}
    </Link>
  )
}

export default function Header() {
  const [isOpen, setIsOpen]     = useState(false)
  const [navPages, setNavPages] = useState<NavPage[]>([])

  const closeMobile = () => setIsOpen(false)

  // Single fetch — build nav from API, filter to navbar: true only
  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res  = await fetch('/api/pages')
        if (!res.ok) throw new Error('Failed to fetch nav pages')
        const data: NavPage[] = await res.json()
        setNavPages(
          data
            .filter((p) => p.navbar)
            .map(({ name, slug, navbar }) => ({ name, slug, navbar }))
        )
      } catch (err) {
        console.error('Header nav fetch failed:', err)
      }
    }
    fetchNav()
  }, [])

  return (
    <div className="sticky top-0 z-50">
      
      <header className="bg-white text-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <Image src="/images/kofc-logo.png" alt="Knights of Columbus Logo" width={100} height={100} />
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
              className="lg:hidden p-2 hover:bg-gray-100 rounded"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Nav bar ───────────────────────────────────────────────────── */}
      <nav className="bg-gradient-to-l from-[#071A4D] to-[#0451A0] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Desktop */}
          <div className="hidden lg:flex items-center justify-center h-14">
            <div className="flex items-center gap-1">
              {navPages.map((page) => (
                <NavLink
                  key={page.slug}
                  href={slugToHref(page.slug)}
                  label={page.name}
                />
              ))}
              <Link
                href="/register"
                className="ml-5 px-4 py-2 border border-accent text-accent font-semibold hover:bg-accent/10 transition-colors rounded-lg text-sm uppercase tracking-wide"
              >
                Join Us
              </Link>
            </div>
            <div className="ml-4 text-accent/95">
              <Link href="/edit" className="hover:text-white transition-colors" aria-label="Edit site">
                <PencilLineIcon className="size-5" />
              </Link>
            </div>
          </div>

          {/* Mobile */}
          {isOpen && (
            <div className="lg:hidden py-4 flex flex-col">
              {navPages.map((page) => (
                <NavLink
                  key={page.slug}
                  href={slugToHref(page.slug)}
                  label={page.name}
                  mobile
                  onClick={closeMobile}
                />
              ))}
              <Link
                href="/register"
                onClick={closeMobile}
                className="px-4 py-3 mt-2 border border-accent text-accent font-semibold hover:bg-accent/10 transition-colors text-center uppercase tracking-wide"
              >
                Join Us
              </Link>
              <div className="mt-1 flex text-accent/95 hover:text-white px-4 py-3 hover:bg-white/10 transition-colors border-y border-white/20 uppercase tracking-wide">
                <Link href="/edit" onClick={closeMobile} className="flex items-center gap-4">
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