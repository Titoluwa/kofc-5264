interface Stat {
  number: string
  label: string
  description?: string
}

interface StatsSectionProps {
  title: string
  subtitle: string
  stats: Stat[]
  variant?: 'horizontal' | 'cards'
}

export default function StatsSection({
  title,
  subtitle,
  stats,
  variant = 'horizontal',
}: StatsSectionProps) {
  return (
    <section className="bg-primary text-primary-foreground py-16 lg:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {title}
          </h2>
          <p className="text-lg text-primary-foreground/95 max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {/* Decorative line */}
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        {/* Stats Grid */}
        {variant === 'horizontal' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl lg:text-6xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-2">{stat.label}</div>
                {stat.description && (
                  <p className="text-primary-foreground/80 text-sm">
                    {stat.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-8 border border-primary-foreground/20">
                <div className="text-4xl font-bold text-accent mb-3">
                  {stat.number}
                </div>
                <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                {stat.description && (
                  <p className="text-primary-foreground/90">
                    {stat.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
