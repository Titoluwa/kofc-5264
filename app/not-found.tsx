import Link from 'next/link'
import { Home, ArrowRight, Search } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/Header'

export default function NotFound() {
    return (
        <div>
        <Header/>
        <main className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">

            {/* Hero Section */}
            <section className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Cross Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative flex items-center justify-center">
                            {/* <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full text-accent"
                        fill="currentColor"
                    >
                        <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="currentColor" strokeWidth="2" />
                        
                        <g transform="translate(50, 50)">
                        <rect x="-4" y="-20" width="8" height="40" fill="currentColor" />
                        <rect x="-20" y="-4" width="40" height="8" fill="currentColor" />
                        </g>
                    </svg> */}
                            <Image src="/images/kofc-5264-logo.png" alt="Logo" width={150} height={150} className='w-64 h-64' />
                        </div>
                    </div>

                    {/* 404 Text */}
                    <div className="mb-6">
                        <h1 className="font-serif text-7xl lg:text-8xl font-bold text-primary mb-2">
                            404
                        </h1>
                        <p className="text-2xl lg:text-3xl font-serif text-foreground mb-2">
                            Page Not Found
                        </p>
                    </div>

                    {/* Message */}
                    <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                        We couldn't find the page you're looking for. It may have been moved, renamed, or perhaps never existed. Let us help you get back on track.
                    </p>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-sm mx-auto">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
                        >
                            <Home className="w-5 h-5" />
                            Home
                        </Link>

                        <Link
                            href="/programs"
                            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
                        >
                            <Search className="w-5 h-5" />
                            Programs
                        </Link>
                    </div>

                    {/* Additional Navigation */}
                    <div className="bg-card border border-border rounded-xl p-8">
                        <h2 className="font-serif text-xl font-bold text-foreground mb-6">Explore Our Site</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* <Link
                                href="/knighthood"
                                className="group flex items-center justify-between p-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                            >
                                <span className="font-medium">Learn About Knighthood</span>
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </Link> */}

                            <Link
                                href="/history"
                                className="group flex items-center justify-between p-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                            >
                                <span className="font-medium">Our History</span>
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </Link>

                            {/* <Link
                                href="/leadership"
                                className="group flex items-center justify-between p-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                            >
                                <span className="font-medium">Meet Our Leadership</span>
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </Link> */}

                            <Link
                                href="/programs"
                                className="group flex items-center justify-between p-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                            >
                                <span className="font-medium">Upcoming Events</span>
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/register"
                                className="group flex items-center justify-between p-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                            >
                                <span className="font-medium">Join Our Community</span>
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/gallery"
                                className="group flex items-center justify-between p-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                            >
                                <span className="font-medium">Digital Scrapbook</span>
                                <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Info */}
            <section className="bg-primary text-primary-foreground py-8 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-sm text-primary-foreground/80 mb-3">
                        Having trouble? Contact us for assistance.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                        <a href="mailto:info@kofc5264.ca" className="hover:text-accent transition-colors font-medium">
                            info@kofc5264.ca
                        </a>
                        {/* <span className="hidden sm:inline text-primary-foreground/50">•</span>
                        <a href="tel:+15551234567" className="hover:text-accent transition-colors font-medium">
                            (555) 123-4567
                        </a> */}
                    </div>
                </div>
            </section>
        </main>
        </div>
    )
}
