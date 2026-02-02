'use client'

import Link from 'next/link'

export default function Footer() {

    return (
        <footer className="bg-primary text-primary-foreground py-16 border-t border-primary-foreground/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="font-semibold mb-4 text-accent">About</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li><Link href="/#who-we-are" className="hover:text-accent transition-colors">Who We Are</Link></li>
                            <li><Link href="/#what-we-do" className="hover:text-accent transition-colors">What We Do</Link></li>
                            <li><Link href="/history" className="hover:text-accent transition-colors">History</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-accent">Programs</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li><Link href="/programs" className="hover:text-accent transition-colors">Faith Formation</Link></li>
                            <li><Link href="/programs" className="hover:text-accent transition-colors">Community Service</Link></li>
                            {/* <li><Link href="/programs" className="hover:text-accent transition-colors">Financial Services</Link></li> */}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-accent">Get Involved</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li><Link href="/join" className="hover:text-accent transition-colors">Join</Link></li>
                            <li><Link href="/programs" className="hover:text-accent transition-colors">Events</Link></li>
                            <li><Link href="/volunteer" className="hover:text-accent transition-colors">Volunteer</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4 text-accent">Contact</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/80">
                            <li>85 Kirkbridge Drive, Winnipeg, <br />Manitoba, R3T 5S7</li>
                            <li>info@kofc5264.ca</li>
                            {/* <li className="text-xs mt-4">© 2024 Community Organization</li> */}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
                    {/* <p>Dedicated to faith, fraternity, and charitable service since 1882</p> */}
                    <p>© 2026 Our Lady of the Prairie, Council 5264</p>
                </div>
            </div>
        </footer>
    )
}