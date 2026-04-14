import Image from 'next/image'

interface EventHeroProps {
    name: string
    image?: string | null
}

export default function EventHero({ name, image }: Readonly<EventHeroProps>) {
    return (
        <div className="relative w-full h-72 sm:h-96 bg-muted overflow-hidden">
            <Image src={image || 'placeholder.svg'} alt={`${name} — image`} fill priority className="object-cover"/>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow">
                        {name}
                    </h1>
                </div>
            </div>
        </div>
    )
}