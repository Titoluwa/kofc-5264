'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='sticky top-0 z-50'>
      {/* Top Bar - Quick Links */}
      {/* <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-10 gap-6 text-sm">
            <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
              Contact Us
            </Link>
            <button className="text-gray-700 hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <header className="bg-white text-primary shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Title */}
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

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Toggle menu">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center h-14">
            <div className="flex items-center gap-1">
              <Link href="/#who-we-are" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide">
                Who we are
              </Link>
              <Link href="/#what-we-do" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide">
                What we do
              </Link>
              <Link href="/resources" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide">
                Resources
              </Link>
              <Link href="/gallery" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide">
                Gallery
              </Link>
              <Link href="/events" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide">
                Events & Information
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 flex flex-col">
              <Link href="/#who-we-are" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                Who we are
              </Link>
              <Link href="/#what-we-do" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                What we do
              </Link>
              <Link href="/resources" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                Resources
              </Link>
              <Link href="/gallery" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                Gallery
              </Link>
              <Link href="/events" className="px-4 py-3 hover:bg-white/10 transition-colors uppercase tracking-wide">
                Events & Information
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}