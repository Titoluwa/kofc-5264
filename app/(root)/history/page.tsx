export const metadata = {
  title: 'Council History | Our Lady of the Prairie, Council 5264',
  description: 'Explore the rich history of Our Lady of the Prairie, Council 5264, and its impact on our community.',
}

export default function HistoryPage() {
  const milestones = [
    { year: '1882', title: 'Knights of Columbus Founded', description: 'Blessed Michael McGivney establishes the Knights of Columbus in New Haven, Connecticut.' },
    { year: '1950s', title: 'Council 5264 Established', description: 'Knights of Columbus - Our Lady of the Prairie, Council 5264 is founded with a mission to serve our local Catholic community.' },
    { year: '1970s', title: 'Community Expansion', description: 'Council grows to over 300 members and launches major charitable initiatives.' },
    { year: '1990s', title: 'Digital Transformation', description: 'Council modernizes with new communication tools while maintaining traditional values.' },
    { year: '2000s', title: 'Program Excellence', description: 'Launches flagship programs including Artarama and expanded charitable work.' },
    { year: 'Today', title: 'A Thriving Community', description: 'Council continues to serve with hundreds of members, dozens of annual programs, and deep community impact.' },
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Our History
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Rooted in faith, dedicated to service, shaping our community for over 70 years.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground">
              From humble beginnings to a vibrant council serving our community with purpose and passion.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          {/* <div className="space-y-12">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-serif font-bold text-lg flex-shrink-0">
                    {idx + 1}
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="w-1 h-24 bg-accent/30 mt-4" />
                  )}
                </div>
                <div className="bg-card p-8 rounded-xl border border-border flex-1">
                  <div className="text-accent font-serif text-2xl font-bold mb-2">{milestone.year}</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground text-lg">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* Legacy Section */}
      {/* <section className="bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-8 border border-border">
              <div className="text-5xl text-accent mb-4">70+</div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Years of Service</h3>
              <p className="text-muted-foreground">
                More than seven decades of dedication to our Catholic faith and community needs.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border">
              <div className="text-5xl text-accent mb-4">$2M+</div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Donated</h3>
              <p className="text-muted-foreground">
                Substantial contributions to charitable causes, religious organizations, and local families.
              </p>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border">
              <div className="text-5xl text-accent mb-4">500+</div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">Active Members</h3>
              <p className="text-muted-foreground">
                A thriving community of Catholic men committed to faith, fraternity, and service.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Founder Story */}
      {/* <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="col-span-2">
              <h2 className="font-serif text-4xl font-bold mb-6">
                Blessed Michael McGivney
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-6 leading-relaxed">
                Founded in 1882 by Blessed Michael McGivney, a priest from New Haven, Connecticut, the Knights of Columbus emerged from a simple but profound vision: that Catholic men could band together to support each other and their families while serving their communities with charity and faith.
              </p>
              <p className="text-lg text-primary-foreground/90 mb-6 leading-relaxed">
                Father McGivney understood that men need brotherhood to stay faithful. He created the Knights as a fraternal organization rooted in Catholic teachings, where men could find mutual aid, spiritual growth, and purpose through service.
              </p>
              <p className="text-lg text-primary-foreground/90 mb-6 leading-relaxed">
                Today, with over 2 million members in thousands of councils worldwide, his vision continues to inspire Catholic men to live their faith boldly and serve with generosity.
              </p>
              <a
                href="/knighthood"
                className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block"
              >
                Learn More About Knighthood
              </a>
            </div>
            <div className="bg-background rounded-2xl p-8 text-foreground text-center">
              <div className="text-accent text-7xl mb-4">✦</div>
              <p className="italic text-lg">
                "A knight is called not for glory or honor, but for the sacred duty to protect, serve, and uplift the vulnerable among us."
              </p>
              <p className="mt-6 font-semibold">— Blessed Michael McGivney, Founder</p>
            </div>
          </div>
        </div>
      </section> */}
    </main>
  )
}
