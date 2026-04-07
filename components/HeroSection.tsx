"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { PageContent } from '@/lib/constants';

const PAGE_SLUG = "#who-we-are";

export default function HeroSection() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);

      // get the page by slug
      const pageRes = await fetch(`/api/pages/content?slug=${encodeURIComponent(PAGE_SLUG)}`);
      if (!pageRes.ok) throw new Error("Failed to load page");
      const page = await pageRes.json();

      // get the specific section by name
      const contentRes = await fetch(`/api/pages/${page.id}/content?name=${encodeURIComponent(PAGE_SLUG)}`);
      if (!contentRes.ok) throw new Error("Failed to load content");
      const section: PageContent = await contentRes.json();

      if (!section) throw new Error("No content found");
      setContent(section);
    } catch {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="relative bg-primary py-20 lg:py-32 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="h-12 bg-primary-foreground/20 rounded w-3/4 mb-6" />
          <div className="h-6 bg-primary-foreground/20 rounded w-1/2 mb-3" />
          <div className="h-6 bg-primary-foreground/20 rounded w-2/3" />
        </div>
      </section>
    );
  }

  if (error || !content) {
    return (
      <section id='who-are-we' className="relative bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-12 lg:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden h-full">
              <Image src={"/images/kofc-logo-nobg.png"} alt={"no image"} width={600} height={600} className="w-full h-full object-cover"  priority/>
            </div>
            <div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
                  Faith. Brotherhood.
                </h1>
                <p className="text-xl text-primary-foreground/95 mb-4 text-pretty leading-relaxed max-w-2xl">
                  Men who believe that faith without works is dead. We don't just profess our beliefs, we live them through service, sacrifice, and solidarity with others.
                </p>
                <p className="text-xl text-primary-foreground/95 mb-8 text-pretty leading-relaxed max-w-2xl">
                  We are united as brothers in faith, and that unity empowers our community and our service to others.
                </p>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={'#'} className="bg-accent text-accent-foreground px-8 py-3 font-semibold hover:opacity-90 transition-opacity text-center rounded-lg">
                      Join Now
                    </Link>
                    
                    <Link href={'#'} className="border-2 border-accent text-accent px-8 py-3 font-semibold hover:bg-accent/10 transition-colors text-center rounded-lg">
                      Our Mission
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id='who-are-we' className="relative bg-linear-to-r from-[#071A4D] to-[#0451A0] text-primary-foreground py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Column - Image */}
          {content.image && (
            <div className="rounded-2xl overflow-hidden h-full">
              <Image src={content.image} alt={content.name} className="w-full h-full object-cover" width={600} height={600} priority/>
            </div>
          )}

          {/* Right Column - Content */}
          <div className={content.image ? '' : 'lg:col-span-2'}>
            {content.mainText && (
              <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
                {content.mainText}
              </h1>
            )}
            {content.subtext1 && (
              <p className="text-xl text-primary-foreground/95 mb-4 text-pretty leading-relaxed max-w-2xl">
                {content.subtext1}
              </p>
            )}
            {content.subtext2 && (
              <p className="text-xl text-primary-foreground/95 mb-8 text-pretty leading-relaxed max-w-2xl">
                {content.subtext2}
              </p>
            )}

            {/* Buttons */}
            {(content.primaryButton || content.secondaryButton) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {content.primaryButton?.text && (
                  <Link
                    href={content.primaryButton.link || '#'}
                    className="bg-accent text-accent-foreground rounded-lg px-8 py-3 font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    {content.primaryButton.text}
                  </Link>
                )}
                {content.secondaryButton?.text && (
                  <Link
                    href={content.secondaryButton.link || '#'}
                    className="border-2 border-accent rounded-lg text-accent px-8 py-3 font-semibold hover:bg-accent/10 transition-colors text-center"
                  >
                    {content.secondaryButton.text}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}