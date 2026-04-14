'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, FileText, Download } from 'lucide-react'
import { FaXTwitter, FaFacebookF, FaLinkedin } from "react-icons/fa6";
import SubscribeNewsletter from '@/components/SubscribeNewsletter'
import { Button } from '@/components/ui/button'
import { Newsletter, CATEGORY_COLORS } from '@/lib/constants'
import { NewsletterDetailSkeleton } from '@/components/skeleton';

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
                setNewsletter(await res.json())
            } catch (err) {
                console.error(err)
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        fetchNewsletter()
    }, [id])

    if (loading) return <NewsletterDetailSkeleton />

    if (notFound || !newsletter) {
        return (
            <main>
                <section className="bg-background py-24">
                    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-7 h-7 text-muted-foreground opacity-60" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
                            Newsletter Not Found
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            The newsletter you're looking for doesn't exist or may have been removed.
                        </p>
                        <Link href="/newsletters" className="inline-flex items-center gap-2 text-accent hover:opacity-80 font-semibold transition-opacity">
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

    const pageUrl    = globalThis.window === undefined
        ? `/newsletters/${newsletter.id}`
        : `${globalThis.window.location.origin}/newsletters/${newsletter.id}`
    const shareTitle = encodeURIComponent(newsletter.title)
    const shareUrl   = encodeURIComponent(pageUrl)


    const shareLinks = [
        {
            href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&t=${shareTitle}`,
            label: 'Share on Facebook',
            icon: FaFacebookF,
            hoverColor: 'hover:text-[#1877F2]',
        },
        {
            href: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`,
            label: 'Share on Twitter',
            icon: FaXTwitter,
            hoverColor: 'hover:text-[#1DA1F2]',
        },
        {
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
            label: 'Share on LinkedIn',
            icon: FaLinkedin,
            hoverColor: 'hover:text-[#0A66C2]',
        },
        {
            href: `mailto:?subject=${shareTitle}&body=Check out this newsletter: ${pageUrl}`,
            label: 'Share via Email',
            icon: Mail,
            hoverColor: 'hover:text-[#1DA1F2]',
        },
    ]

    let bodyContent = null;
    if (newsletter.content) {
        bodyContent = (
            <div
                className="prose prose-lg max-w-none text-foreground leading-relaxed
                    prose-headings:font-serif prose-headings:text-foreground
                    prose-p:text-foreground prose-li:text-foreground
                    prose-strong:text-foreground prose-a:text-accent
                    prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{
                        __html: newsletter.content
                            .replaceAll('&', "&amp;")
                            .replaceAll('<', "&lt;")
                            .replaceAll('>', "&gt;")
                            .replaceAll('\n', "<br />")
                    }}
            />
        );
    } else if (newsletter.file) {
        bodyContent = (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-foreground">Newsletter Attachment</p>
                </div>
                <p className="text-foreground">
                    This newsletter is available as a file. You can view it in your browser or download it to read offline.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <a
                        href={newsletter.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        <FileText className="w-4 h-4 text-accent shrink-0" />
                        View 
                    </a>
                    <a
                        href={newsletter.file}
                        download
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                        <Download className="w-4 h-4 text-accent shrink-0" />
                        Download 
                    </a>
                </div>
            </div>
        );
    }

    return (
        <main>

            <section className="bg-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/newsletters" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Newsletters
                    </Link>
                </div>
            </section>

            {newsletter.heroImage && (
                <div className="w-full h-72 md:h-96 bg-muted overflow-hidden">
                    <img
                        src={newsletter.heroImage}
                        alt={newsletter.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <section className="bg-background py-12 lg:py-16">
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <header className="mb-10 space-y-4">
                        {newsletter.category && (
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${catColor.bg} ${catColor.text}`}>
                                {newsletter.category}
                            </span>
                        )}

                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
                            {newsletter.title}
                        </h1>

                        {newsletter.subtitle && (
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {newsletter.subtitle}
                            </p>
                        )}

                        {formattedDate && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                <Calendar className="w-4 h-4 text-accent shrink-0" />
                                <span>{formattedDate}</span>
                            </div>
                        )}
                    </header>

                    {/* Divider */}
                    <div className="h-px bg-border mb-10" />

                    {/* Body — rich text content takes priority; file attachment as fallback */}
                    {bodyContent}

                    {/* Share */}
                    <div className="mt-14 pt-8 border-t border-border">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                            Share this newsletter
                        </p>
                        <div className="flex gap-1">
                            {shareLinks.map(({ href, label, icon: Icon, hoverColor }) => (
                                <Button key={label} size="icon" variant="ghost" className={`transition-colors hover:bg-transparent ${hoverColor}`} asChild>
                                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                                        <Icon className="w-4 h-4" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                </article>
            </section>

            <SubscribeNewsletter />
        </main>
    )
}