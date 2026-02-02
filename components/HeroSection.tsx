import Image from 'next/image'
import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  imageUrl?: string
}

export default function HeroSection({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  imageUrl,
}: HeroSectionProps) {
  return (
    <section className="relative bg-primary text-primary-foreground py-20 lg:py-32 overflow-hidden">
      {/* Decorative wavy divider top */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-background"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
          backgroundColor: 'var(--color-background)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Images */}
          {imageUrl && (
            <div className="flex gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden h-96 lg:h-full flex items-center justify-center">
                <Image src={"/images/kofc-5264-logo.png"} alt="Logo" className="w-full h-full object-cover" width={100} height={100} />
              </div>
            </div>
          )}

          {/* Right Column - Content */}
          <div className={`flex flex-col justify-center ${imageUrl ? '' : 'lg:col-span-3'}`}>
            <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
              {title}
            </h1>
            <p className="text-xl text-primary-foreground/95 mb-8 text-pretty leading-relaxed max-w-2xl">
              {subtitle}
            </p>

            {/* Buttons */}
            {(primaryButtonText || secondaryButtonText) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {primaryButtonText && (
                  <Link
                    href={primaryButtonHref || '#'}
                    className="bg-accent text-accent-foreground px-8 py-3   font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    {primaryButtonText}
                  </Link>
                )}
                {secondaryButtonText && (
                  <Link
                    href={secondaryButtonHref || '#'}
                    className="border-2 border-accent text-accent px-8 py-3   font-semibold hover:bg-accent/10 transition-colors text-center"
                  >
                    {secondaryButtonText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative wavy divider bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20"
        style={{
          clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)',
          backgroundColor: 'var(--color-background)',
        }}
      />
    </section>
  )
}
