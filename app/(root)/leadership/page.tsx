export const metadata = {
  title: 'Leadership & Executives | Our Lady of the Prairie, Council 5264',
  description: 'Meet the officers and leadership team guiding Our Lady of the Prairie, Council 5264.',
}

export default function LeadershipPage() {
  const currentOfficers = [
    { position: 'Grand Knight', name: 'Thomas O\'Brien', email: 'tom@kofc5264.ca', term: '2024-2025' },
    { position: 'Deputy Grand Knight', name: 'Michael Rodriguez', email: 'michael@kofc5264.ca', term: '2024-2025' },
    { position: 'Chancellor', name: 'David Chen', email: 'david@kofc5264.ca', term: '2024-2025' },
    { position: 'Recorder', name: 'James Murphy', email: 'james@kofc5264.ca', term: '2024-2025' },
    { position: 'Treasurer', name: 'William Szabo', email: 'william@kofc5264.ca', term: '2024-2025' },
    { position: 'Advocate', name: 'Patrick Sullivan', email: 'patrick@kofc5264.ca', term: '2024-2025' },
  ]

  const pastLeaders = [
    { year: '2022-2024', leader: 'Robert Kowalski' },
    { year: '2020-2022', leader: 'Christopher Walsh' },
    { year: '2018-2020', leader: 'Daniel Fitzgerald' },
    { year: '2016-2018', leader: 'Joseph Anderson' },
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Our Leadership
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              Dedicated men guiding our council with faith, integrity, and vision.
            </p>
          </div>
        </div>
      </section>

      {/* Current Officers */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Current Officers
            </h2>
            <p className="text-lg text-muted-foreground">
              Our executive team is committed to advancing the council's mission.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentOfficers.map((officer, idx) => (
              <div key={idx} className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <div className="text-accent text-2xl">✦</div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{officer.name}</h3>
                <p className="text-accent font-semibold mb-4">{officer.position}</p>
                <p className="text-muted-foreground text-sm mb-2">
                  <span className="font-medium">Term:</span> {officer.term}
                </p>
                <a href={`mailto:${officer.email}`} className="text-accent hover:text-accent/80 text-sm font-medium transition-colors">
                  {officer.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Council Structure */}
      <section className="bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-12 text-center">
            Council Structure
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-8 border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Core Officers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Grand Knight - Executive leadership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Deputy Grand Knight - Administrative support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Chancellor - Membership liaison</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Recorder - Official documentation</span>
                </li>
              </ul>
            </div>

            <div className="bg-background rounded-xl p-8 border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Financial</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Treasurer - Fund management</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Advocate - Legal & ethical matters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Financial Secretary - Records & reporting</span>
                </li>
              </ul>
            </div>

            <div className="bg-background rounded-xl p-8 border border-border">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Programs & Service</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Program Directors - Event coordination</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Chairmen - Committee leadership</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-1">•</span>
                  <span>Volunteer Coordinators - Service mobilization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Past Leaders */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Honoring Our Past Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              These men have guided our council with dedication and vision.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {pastLeaders.map((leader, idx) => (
                <div key={idx} className="p-8 flex items-center justify-between hover:bg-background/50 transition-colors">
                  <span className="font-serif text-lg font-bold text-foreground">{leader.year}</span>
                  <span className="text-muted-foreground text-lg">{leader.leader}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-muted-foreground mt-12 italic">
            We honor these leaders who have shaped our council's legacy of service and faith.
          </p>
        </div>
      </section>
    </main>
  )
}
