"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface ButtonField {
    text: string;
    link: string;
}

interface ListItem {
    icon: string;
    title: string;
    description: string;
}

interface PageContent {
    id: number;
    pageId: number;
    name: string;
    image: string | null;
    mainText: string | null;
    subtext1: string | null;
    subtext2: string | null;
    subtext3: string | null;
    lists: string[] | ListItem[];
    primaryButton: ButtonField | null;
    secondaryButton: ButtonField | null;
}

const DEFAULT_CONTENT: PageContent = {
    id: 0,
    pageId: 0,
    name: "what-we-do",
    image: null,
    mainText: "Real Stories. Real Impact.",
    subtext1: "From growing in faith to helping those most in need, Knights of Columbus are putting their faith into action, living out our mission and making a real difference.",
    subtext2: "",
    subtext3: null,
    lists: [
        { icon: "✦", description: "Charity", title: "" },
        { icon: "✦", description: "Unity", title: "" },
        { icon: "✦", description: "Fraternity", title: "" },
    ],
    primaryButton: { text: "Join Us", link: "#" },
    secondaryButton: { text: "Learn More", link: "#" },
};

const PAGE_SLUG = "what-we-do";

function parseListItems(lists: string[] | ListItem[]): ListItem[] {
    if (!lists || lists.length === 0) return [];
    return lists.map((item) => {
        if (typeof item === 'string') {
            try {
                return JSON.parse(item) as ListItem;
            } catch {
                return { icon: '✦', title: '', description: item };
            }
        }
        return item;
    });
}

function SkeletonLoader() {
    return (
        <section className="bg-background py-16 lg:py-24 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
                <div className="space-y-3 pt-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 bg-muted rounded shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                    </div>
                ))}
                </div>
                <div className="h-12 bg-muted rounded w-40 mt-4" />
            </div>
            <div className="h-96 bg-muted rounded-xl" />
            </div>
        </div>
        </section>
    );
}

export default function WhatWeDoSection() {
    const [content, setContent] = useState<PageContent>(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchContent(); }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);

            const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`);
            if (!pageRes.ok) throw new Error("Failed to load page");
            const page = await pageRes.json();

            const contentRes = await fetch(`/api/pages/${page.id}/content?name=${encodeURIComponent(PAGE_SLUG)}`);
            if (!contentRes.ok) throw new Error("Failed to load content");
            const section: PageContent = await contentRes.json();

            if (!section) throw new Error("No content found");

            setContent({
                ...DEFAULT_CONTENT,
                ...section,
                lists: section.lists?.length ? section.lists : DEFAULT_CONTENT.lists,
                primaryButton: section.primaryButton ?? DEFAULT_CONTENT.primaryButton,
                secondaryButton: section.secondaryButton ?? DEFAULT_CONTENT.secondaryButton,
            });
        } catch {
            // Keep DEFAULT_CONTENT already set in state — nothing to do
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <SkeletonLoader />;

    const listItems = parseListItems(content.lists);

    return (
        <section id="what-we-do" className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — Content */}
            <div>
                {content.mainText && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-12 bg-accent rounded shrink-0" />
                        <h2 className="font-serif text-3xl font-bold text-foreground">
                            {content.mainText}
                        </h2>
                    </div>
                )}

                {content.subtext1 && (
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {content.subtext1}
                    </p>
                )}

                {content.subtext2 && (
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        {content.subtext2}
                    </p>
                )}

                {listItems.length > 0 && (
                    <div className="space-y-4 mb-8">
                        {listItems.map((item, i) => (
                        <div key={i + 1} className="flex gap-4">
                            <div className="text-3xl shrink-0">{item.icon || '✦'}</div>
                            <div className='flex items-center'>
                                {item.description && (
                                    <p className="font-semibold text-foreground mb-1">{item.description}</p>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                {content.primaryButton?.text && (
                    <Link
                        href={content.primaryButton.link || '#'}
                        className="bg-accent text-accent-foreground px-8 py-3 font-semibold hover:opacity-90 transition-opacity text-center inline-block"
                    >
                        {content.primaryButton.text}
                    </Link>
                )}
                {content.secondaryButton?.text && (
                    <Link
                        href={content.secondaryButton.link || '#'}
                        className="border-2 border-accent text-accent px-8 py-3 font-semibold hover:bg-accent/10 transition-colors text-center inline-block"
                    >
                        {content.secondaryButton.text}
                    </Link>
                )}
                </div>
            </div>

            {/* Right — Image */}
            <div className="overflow-hidden rounded-xl h-96 lg:h-full">
                <Image
                    src={content.image ?? "/images/kofc-5264-nobg.png"}
                    alt={content.mainText ?? 'Section image'}
                    className="w-full h-full object-cover"
                    width={600}
                    height={600}
                />
            </div>

            </div>
        </div>
        </section>
    );
}