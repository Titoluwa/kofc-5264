'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, Facebook, Twitter, Linkedin, Loader2 } from 'lucide-react'
import SubscribeNewsletter from '@/components/SubscribeNewsletter'
import { Button } from '@/components/ui/button'
import { Newsletter, CATEGORY_COLORS } from '@/lib/constants'

const DEFAULT_COLOR = { bg: 'bg-muted', text: 'text-muted-foreground' }

export default function NewsletterDetailPage() {
    const { id } = useParams<{ id: string }>()

    const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
    const [loading, setLoading]       = useState(true)
    const [notFound, setNotFound]     = useState(false)

    useEffect(() => {
        if (!id) return

        const fetchNewsletter = async () => {
        try {
            setLoading(true)
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ''
            const res     = await fetch(`${baseUrl}/api/newsletters/${id}`)
            if (res.status === 404) { setNotFound(true); return }
            if (!res.ok) throw new Error(`Failed to fetch newsletter: ${res.status}`)
            const data: Newsletter = await res.json()
            setNewsletter(data)
        } catch (err) {
            console.error(err)
            setNotFound(true)
        } finally {
            setLoading(false)
        }
        }

        fetchNewsletter()
    }, [id])

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading newsletter…</span>
                </div>
            </main>
        )
    }

    if (notFound || !newsletter) {
        return (
        <main>
            <section className="bg-background py-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                Newsletter Not Found
                </h1>
                <p className="text-muted-foreground mb-6">
                The newsletter you're looking for doesn't exist or may have been removed.
                </p>
                <Link
                href="/newsletters"
                className="text-accent hover:text-accent/80 font-semibold flex items-center gap-2 justify-center"
                >
                <ArrowLeft className="w-4 h-4" />
                Back to Newsletters
                </Link>
            </div>
            </section>
            <SubscribeNewsletter />
        </main>
        )
    }

    const dateStr       = newsletter.publishedDate ?? newsletter.createdAt
    const formattedDate = dateStr
        ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : ''

    const catColor = newsletter.category
        ? (CATEGORY_COLORS[newsletter.category] ?? DEFAULT_COLOR)
        : DEFAULT_COLOR

    const pageUrl    = typeof window !== 'undefined'
        ? `${window.location.origin}/newsletters/${newsletter.id}`
        : `/newsletters/${newsletter.id}`

    const shareTitle = encodeURIComponent(newsletter.title)
    const shareUrl   = encodeURIComponent(pageUrl)

    return (
        <main>
        {/* Back Button */}
        <section className="bg-background border-b border-border">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
                href="/newsletters"
                className="text-primary hover:text-accent transition-colors font-semibold flex items-center gap-2 w-fit"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Newsletters
            </Link>
            </div>
        </section>

        {/* Hero Image */}
        {newsletter.heroImage && (
            <div className="w-full h-80 md:h-96 bg-muted overflow-hidden">
            <img
                src={newsletter.heroImage}
                alt={newsletter.title}
                className="w-full h-full object-cover"
            />
            </div>
        )}

        {/* Content */}
        <section className="bg-background py-12 lg:py-16">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <header className="mb-10">
                {newsletter.category && (
                <div className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-semibold ${catColor.bg} ${catColor.text}`}>
                    {newsletter.category}
                </div>
                )}

                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-3 text-balance leading-tight">
                {newsletter.title}
                </h1>

                {newsletter.subtitle && (
                <p className="text-xl text-muted-foreground mb-5">
                    {newsletter.subtitle}
                </p>
                )}

                {formattedDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
                )}
            </header>

            {/* Body */}
            <div
                className="prose prose-lg prose-blue max-w-none text-foreground leading-relaxed
                prose-headings:font-serif prose-headings:text-foreground
                prose-p:text-foreground prose-li:text-foreground
                prose-strong:text-foreground prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: newsletter.content }}
            />

            {/* Share */}
            <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3 font-medium">Share this newsletter:</p>
                <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="hover:text-[#1877F2] transition-colors" asChild>
                    <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`}
                    target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
                    >
                    <Facebook className="w-4 h-4" />
                    </a>
                </Button>

                <Button size="icon" variant="ghost" className="hover:text-[#1DA1F2] transition-colors" asChild>
                    <a
                    href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter"
                    >
                    <Twitter className="w-4 h-4" />
                    </a>
                </Button>

                <Button size="icon" variant="ghost" className="hover:text-[#0A66C2] transition-colors" asChild>
                    <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                    target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
                    >
                    <Linkedin className="w-4 h-4" />
                    </a>
                </Button>

                <Button size="icon" variant="ghost" className="hover:text-accent transition-colors" asChild>
                    <a
                    href={`mailto:?subject=${shareTitle}&body=Check out this newsletter: ${pageUrl}`}
                    aria-label="Share via Email"
                    >
                    <Mail className="w-4 h-4" />
                    </a>
                </Button>
                </div>
            </div>

            </article>
        </section>

        <SubscribeNewsletter />
        </main>
    )
}