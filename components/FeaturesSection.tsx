import React from 'react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
}

interface FeaturesSectionProps {
  title: string
  subtitle: string
  features: Feature[]
  variant?: 'grid' | 'list'
}

export default function FeaturesSection({
  title,
  subtitle,
  features,
  variant = 'grid',
}: FeaturesSectionProps) {
  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Decorative icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary   rotate-45 flex items-center justify-center">
              <div className="text-white text-2xl -rotate-45">✦</div>
            </div>
          </div>

          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        {/* Features Grid */}
        {variant === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-card rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow border border-border">
                {/* Icon */}
                <div className="text-5xl mb-4">{feature.icon}</div>

                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {feature.link && feature.linkText && (
                  <a
                    href={feature.link}
                    className="text-primary font-semibold hover:text-accent transition-colors inline-flex items-center gap-2"
                  >
                    {feature.linkText}
                    <span>→</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-card rounded-xl p-8 shadow-sm border border-border flex gap-6">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">{feature.icon}</div>

                <div className="flex-1">
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  {feature.link && feature.linkText && (
                    <a
                      href={feature.link}
                      className="text-primary font-semibold hover:text-accent transition-colors inline-flex items-center gap-2"
                    >
                      {feature.linkText}
                      <span>→</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
