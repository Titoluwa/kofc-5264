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
              <div className="flex-1 rounded-2xl overflow-hidden h-96 lg:h-full bg-white/10 flex items-center justify-center">
                <Image src={"/images/kofc-logo.png"} alt="Community" className="w-full h-full object-cover" width={100} height={100} />
                {/* <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Community"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23374151%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominantBaseline=%22middle%22 textAnchor=%22middle%22 fontFamily=%22sans-serif%22 fontSize=%2214%22 fill=%22%23ffffff%22%3EImage%3C/text%3E%3C/svg%3E'
                  }}
                /> */}
              </div>
            </div>
          )}

          {/* Right Column - Content */}
          <div className={`flex flex-col justify-center ${imageUrl ? '' : 'lg:col-span-2'}`}>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-balance mb-6">
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
                    className="bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-center"
                  >
                    {primaryButtonText}
                  </Link>
                )}
                {secondaryButtonText && (
                  <Link
                    href={secondaryButtonHref || '#'}
                    className="border-2 border-accent text-accent px-8 py-3 rounded-lg font-semibold hover:bg-accent/10 transition-colors text-center"
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
