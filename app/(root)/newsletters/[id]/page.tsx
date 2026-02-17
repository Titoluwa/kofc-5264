import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, Facebook, Twitter, Linkedin, icons } from 'lucide-react'
import SubscribeNewsletter from '@/components/SubscribeNewsletter'
import { Button } from '@/components/ui/button'

interface NewsletterDetail {
    id: string
    title: string
    subtitle: string
    publishDate: string
    category: 'General' | 'Events' | 'Announcements' | 'Programs' | 'Charity'
    image?: string
    content: string
    author?: string
}

const newsletters: Record<string, NewsletterDetail> = {
    '1': {
        id: '1',
        title: 'Spring into Service',
        subtitle: 'April 2025 Newsletter',
        publishDate: '2025-04-01',
        category: 'Programs',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
        author: 'Grand Knight John Smith',
        content: `
        <h2>Welcome to Spring 2025</h2>
        <p>As we enter the spring season, our council is excited to announce a series of meaningful programs and community service opportunities. This quarter promises to be filled with fellowship, growth, and significant impact on our local community.</p>

        <h3>Upcoming Programs</h3>
        <p><strong>Feed the Hungry Initiative</strong> - Join us every Saturday from 9 AM to 12 PM at the community center as we prepare and distribute meals to those in need. No experience necessary!</p>
        
        <p><strong>Youth Leadership Program</strong> - We're launching a new 8-week program for young men and women interested in developing leadership skills. Sessions begin April 15th.</p>
        
        <p><strong>Artarama 2025</strong> - Our annual art festival returns May 10-11 at the fairgrounds. We're looking for vendor applications and volunteers. Learn more at artarama.council5264.org</p>

        <h3>Service Hours Report</h3>
        <p>In the first quarter of 2025, our council members contributed over 150 volunteer hours and donated \$8,500 to local charities. Thank you for embodying our principle of Charity in action.</p>

        <h3>Upcoming Events</h3>
        <ul>
            <li>April 5: Family Pancake Breakfast (8 AM - 12 PM)</li>
            <li>April 12: Faith Formation Session - "Living Your Vocation"</li>
            <li>April 19: Charity Drive Planning Meeting</li>
            <li>April 26: Social - Bowling Night for Families</li>
        </ul>

        <h3>Member Spotlight</h3>
        <p>This month we recognize Sir Knight Michael Johnson for his 15 years of service and dedication to our council's mission. Michael has been instrumental in organizing our charitable drives and mentoring new members.</p>

        <h3>Get Involved</h3>
        <p>Whether you're a current member looking to increase your involvement or a prospective member interested in joining, there's a place for you in our council. Visit our website to learn more about membership or volunteer opportunities.</p>

        <p>In Fraternity,<br/>Grand Knight John Smith</p>
        `
    },
    '2': {
        id: '2',
        title: 'Charity Spotlight: Our Impact',
        subtitle: 'March 2025 Newsletter',
        publishDate: '2025-03-01',
        category: 'Charity',
        image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=400&fit=crop',
        author: 'Charity Director Robert Williams',
        content: `
        <h2>Making a Real Difference</h2>
        <p>Our council continues to live out the principle of Charity through meaningful community service. This quarter, our members have made a substantial impact on families and individuals in need.</p>

        <h3>2025 Q1 Charity Summary</h3>
        <p><strong>Funds Donated:</strong> \$50,000<br/>
        <strong>Volunteer Hours:</strong> 500+ hours<br/>
        <strong>Families Served:</strong> 350+<br/>
        <strong>Meal Programs:</strong> 8 active initiatives</p>

        <h3>Featured Programs</h3>
        <p><strong>Food Pantry Restoration</strong> - Working with St. Vincent de Paul, we've restocked the community food pantry with over 2,000 pounds of non-perishable items and fresh produce.</p>

        <p><strong>Homeless Outreach</strong> - Our Winter Warmth program provided blankets, socks, and hygiene kits to 150+ individuals experiencing homelessness.</p>

        <p><strong>Youth Mentoring</strong> - Twenty-five council members are actively mentoring at-risk youth, providing academic support and character development.</p>

        <h3>Success Stories</h3>
        <p>"The Knights of Columbus have been a blessing to our family," says Maria Rodriguez, a single mother of three. "Their support helped us get back on our feet when we needed it most."</p>

        <h3>How You Can Help</h3>
        <p>We're always looking for more volunteers to join our charitable efforts. Whether it's packing food boxes, mentoring youth, or organizing fundraisers, every contribution makes a difference.</p>

        <p>Contact our Charity Director to get involved today!</p>
        `
    },
    '3': {
        id: '3',
        title: 'Artarama 2025 Celebrates Local Artists',
        subtitle: 'February 2025 Newsletter',
        publishDate: '2025-02-15',
        category: 'Events',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
        author: 'Events Coordinator Sarah Martinez',
        content: `
        <h2>Artarama 2025 - Celebrating Creativity and Community</h2>
        <p>Our most anticipated annual event returns May 10-11, 2025. Artarama showcases the incredible talent in our community and raises funds for our charitable programs.</p>

        <h3>Event Details</h3>
        <p><strong>Dates:</strong> May 10-11, 2025<br/>
        <strong>Location:</strong> Fairgrounds Exhibition Center<br/>
        <strong>Hours:</strong> 10 AM - 6 PM both days<br/>
        <strong>Admission:</strong> Free to Public</p>

        <h3>Featured Artists</h3>
        <p>We're excited to feature over 150 local artists working in diverse mediums including painting, sculpture, photography, jewelry, ceramics, and more.</p>

        <h3>How to Participate</h3>
        <p><strong>Artists:</strong> Vendor applications are now open. Registration fee is \$75-\$150 depending on booth size. Visit our website to apply.</p>

        <p><strong>Volunteers:</strong> We need 100+ volunteers for setup, operation, and cleanup. Sign up at artarama.council5264.org</p>

        <p><strong>Sponsors:</strong> Help make Artarama possible! Sponsorship packages available starting at \$500.</p>

        <h3>Special Events During Artarama</h3>
        <ul>
            <li>Live painting demonstrations</li>
            <li>Children's art workshops</li>
            <li>Local musician performances</li>
            <li>Food court featuring local restaurants</li>
            <li>Silent auction of selected artworks</li>
        </ul>

        <h3>Last Year's Success</h3>
        <p>In 2024, Artarama attracted 5,000+ attendees, raised \$25,000 for our charitable programs, and provided exposure for 140+ artists.</p>

        <p>We're confident 2025 will be our biggest year yet!</p>
        `
    }
}

export async function generateStaticParams() {
    return Object.keys(newsletters).map(id => ({
        id
    }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
    const newsletter = newsletters[3]
    return {
        title: `${newsletter?.title} | Newsletters`,
        description: newsletter?.subtitle
    }
}

export default function NewsletterDetail({ params }: { params: { id: string } }) {
    const newsletter = newsletters[3]

    if (!newsletter) {
        return (
            <main>
                <section className="bg-background py-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                    Newsletter Not Found
                    </h1>
                    <p className="text-muted-foreground mb-6">
                    The newsletter you're looking for doesn't exist.
                    </p>
                    <Link href="/newsletters" className="text-accent hover:text-accent/80 font-semibold flex items-center gap-2 justify-center">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Newsletters
                    </Link>
                </div>
                </section>
                <SubscribeNewsletter />
            </main>
        )
    }

    const date = new Date(newsletter.publishDate)
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const categoryColors = {
        General: { bg: 'bg-primary/10', text: 'text-primary' },
        Events: { bg: 'bg-accent/10', text: 'text-accent' },
        Announcements: { bg: 'bg-blue-500/10', text: 'text-blue-600' },
        Programs: { bg: 'bg-purple-500/10', text: 'text-purple-600' },
        Charity: { bg: 'bg-green-500/10', text: 'text-green-600' }
    }

    const categoryColor = categoryColors[newsletter.category]

    return (
        <main>
        {/* Back Button */}
        <section className="bg-background border-b border-border flex items-center justify-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <Link href="/newsletters" className="text-primary hover:text-accent/80 font-semibold flex items-center gap-2">
                    {/* <ArrowLeft className="w-4 h-4" /> */}
                    Back to Newsletters
                </Link>
            </div>
        </section>

        {/* Hero Image */}
        {newsletter.image && (
            <div className="w-full h-96 bg-muted overflow-hidden">
                <img src={newsletter.image || "/placeholder.svg"} alt={newsletter.title} className="w-full h-full object-cover"/>
            </div>
        )}

        {/* Newsletter Content */}
        <section className="bg-background py-12 lg:py-16">
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8">
                <div className={`inline-block mb-4 px-3 py-1 rounded-full text-sm font-semibold ${categoryColor.bg} ${categoryColor.text}`}>
                {newsletter.category}
                </div>
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-3 text-balance">
                {newsletter.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                {newsletter.subtitle}
                </p>
                <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formattedDate}
                </div>
                {newsletter.author && (
                    <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {newsletter.author}
                    </div>
                )}
                </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-lg prose-blue max-w-none">
                <div dangerouslySetInnerHTML={{ __html: newsletter.content }} className="text-foreground leading-relaxed space-y-6">
                </div>
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-border">
                <p className="text-muted-foreground mb-4">Share this newsletter:</p>
                <div className="flex gap-2">
                <Button size="icon" variant={"ghost"}  className="px-3 py-2 rounded-none hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" />
                    {/* Share on Facebook */}
                </Button>
                <Button size="icon" variant={"ghost"} className="px-3 py-2 rounded-none hover:opacity-90 transition-opacity">
                    <Twitter className="w-4 h-4" />
                    {/* Share on Twitter */}
                </Button>
                <Button size="icon" variant={"ghost"} className="px-3 py-2 rounded-none hover:opacity-90 transition-opacity">
                    <Linkedin className="w-4 h-4" />
                    {/* Share on Linkedin */}
                </Button>
                <Button size="icon" variant={"ghost"} className="px-3 py-2 rounded-none hover:opacity-90 transition-opacity">
                    <Mail className="w-4 h-4" />
                    {/* Share via Email */}
                </Button>

                </div>
            </div>
            </article>
        </section>

        {/* Related Newsletters */}
        {/* <section className="bg-muted/30 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                Other Newsletters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.values(newsletters)
                .filter(n => n.id !== params.id)
                .slice(0, 2)
                .map(n => (
                    <Link
                    key={n.id}
                    href={`/newsletters/${n.id}`}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-accent transition-all group"
                    >
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-accent transition-colors mb-2">
                        {n.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        {n.subtitle}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{new Date(n.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    </Link>
                ))}
            </div>
            </div>
        </section> */}

        <SubscribeNewsletter />
        </main>
    )
}
