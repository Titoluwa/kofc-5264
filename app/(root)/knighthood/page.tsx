import { Heart, Shield, Users, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Knighthood Of Columbus | Our Lady of the Prairie, Council 5264',
  description: 'Learn about the principles, values, and calling of membership in the Knights of Columbus.',
}

export default function KnighthoodPage() {
  const principles = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Charity',
      description: 'We serve the poor, sick, and suffering. Charity is the foundation of all we do, guiding our mission to care for those in need.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Unity',
      description: 'We stand together as brothers in faith. Unity strengthens our community and our ability to serve.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Fraternity',
      description: 'We build lasting bonds through fellowship and mutual support. Fraternity creates the brotherhood that defines our organization.'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Patriotism',
      description: 'We love our country and defend its freedoms. Patriotism calls us to be engaged citizens and faithful stewards.'
    }
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-serif text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Knighthood Of Columbus
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
              More than 140 years of Catholic men living their faith through action, service, and brotherhood.
            </p>
          </div>
        </div>
      </section>

      {/* Four Principles */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Four Principles
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core values guide every Knight and every decision we make as an organization.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, idx) => (
              <div key={idx} className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
                <div className="text-accent mb-4">
                  {principle.icon}
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-6">
                Faith in Action
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Knights are Catholic men who believe that faith without works is dead. We don't just profess our beliefs—we live them through service, sacrifice, and solidarity with others.
                </p>
                <p>
                  As members, we commit to:
                </p>
                <ul className="space-y-3 ml-6 list-disc">
                  <li>Living our Catholic faith with integrity and purpose</li>
                  <li>Supporting our parish and strengthening faith formation</li>
                  <li>Serving those in need without expectation of reward</li>
                  <li>Building community through fellowship and shared purpose</li>
                  <li>Protecting and promoting the dignity of all human life</li>
                </ul>
                <p>
                  Whether you're new to the faith or a lifelong Catholic, knighthood offers a path to deepen your spiritual journey while making a real difference in your community.
                </p>
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-12 text-primary-foreground">
              <div className="text-6xl mb-6 leading-loose">
                <div className="text-accent mb-4">✦</div>
              </div>
              <h3 className="font-serif text-3xl font-bold mb-6">
                Are You Called?
              </h3>
              <p className="text-lg mb-8 text-primary-foreground/90">
                If you're a practicing Catholic man interested in deepening your faith, building meaningful friendships, and serving your community, we'd like to meet you.
              </p>
              <a
                href="/register"
                className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity inline-block"
              >
                Learn About Membership
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Degrees of Membership */}
      <section className="bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Degrees of Membership
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your journey through knighthood unfolds through sacred degrees that deepen your commitment and understanding.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: 'First', title: 'Charity', description: 'Introduction to the principles of charity and fraternal support.' },
              { number: 'Second', title: 'Unity', description: 'Deepening your understanding of unity and brotherhood in the Church.' },
              { number: 'Third', title: 'Fraternity', description: 'Exploring the sacred bonds of fraternity and mutual aid.' },
              { number: 'Fourth', title: 'Patriotism', description: 'Commitment to faith, country, and defending religious freedom.' }
            ].map((degree, idx) => (
              <div key={idx} className="bg-card rounded-xl p-8 border border-border text-center">
                <div className="text-5xl font-serif text-accent mb-4">{degree.number}</div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {degree.title}
                </h3>
                <p className="text-muted-foreground">
                  {degree.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
