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
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 hover:bg-gray-100  " aria-label="Toggle menu">
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
              <Link href="/" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg">
                {/* /#who-we-are */}
                Who we are
              </Link>
              <Link href="/" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg">
                {/* /#what-we-do */}
                What we do
              </Link>
              <Link href="/" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg">
                {/* /resources */}
                Resources
              </Link>
              <Link href="/" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg">
                {/* /newsletters */}
                Newsletters
              </Link>
              <Link href="/" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg">
                {/* /gallery */}
                Gallery
              </Link>
              <Link href="/" className="px-4 py-2 hover:bg-white/10 transition-colors text-sm font-medium uppercase tracking-wide rounded-lg">
                {/* /programs */}
                Programs & Events
              </Link>
              <Link href="/" className="ml-5 px-4 py-2 border-1 border-accent text-accent font-semibold hover:bg-accent/10 transition-colors text-center rounded-lg">
                {/* /register */}
                Join Us
              </Link>
            </div>
            {/* <div className='ml-4 text-accent/95'>
              <Link href="/edit" className="hover:text-white">
                <PencilLineIcon className='size-5'/> 
              </Link>
            </div> */}
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 flex flex-col">
              <Link href="/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                {/* /#who-we-are */}
                Who we are
              </Link>
              <Link href="/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                {/* /#what-we-do */}
                What we do
              </Link>
              <Link href="/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                {/* /resources */}
                Resources
              </Link>
              <Link href="/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                {/* /newsletters */}
                Newsletters
              </Link>
              <Link href="/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                {/* /gallery */}
                Gallery
              </Link>
              <Link href="/" className="px-4 py-3 mb-2 hover:bg-white/10 transition-colors border-b border-white/20 uppercase tracking-wide">
                {/* /programs */}
                Programs & Events
              </Link>
              <Link href="/" className="px-4 py-3 border-1 border-accent text-accent font-semibold hover:bg-accent/10 transition-colors text-center">
                {/* /register */}
                Join Us
              </Link>
              {/* <div className='mt-1 flex text-center text-accent/95 hover:text-white  px-4 py-3 hover:bg-white/10 transition-colors border-y border-white/20 uppercase tracking-wide'>
                <Link href="/edit" className="flex flex-row items-center gap-4 ">
                  <PencilLineIcon className='size-5'/> Edit site
                </Link>
              </div> */}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}