import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Crimson_Text, Lora } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _crimsonText = Crimson_Text({ subsets: ["latin"], weight: ["400", "600", "700"] });
const _lora = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Our Lady of the Prairie, Council 5264',
  description: 'Join our Catholic community organization dedicated to faith formation, fraternal brotherhood, and charitable service.',
  icons: {
    icon: [
      {
        url: '/images/kofc-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/kofc-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/images/kofc-logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/images/kofc-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
