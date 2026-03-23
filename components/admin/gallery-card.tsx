import Image from "next/image"
import { Images } from "lucide-react"
import { GalleryItem } from "@/lib/constants"

export default function GalleryCard({ item, onOpenLightbox, }: Readonly<{ item: GalleryItem; onOpenLightbox: (item: GalleryItem, index: number) => void }>) {
    const allImages = [
        ...(item.heroImage ? [item.heroImage] : []),
        ...(item.images ?? []),
    ]

    const coverImage = allImages[0]
    const extraCount = allImages.length - 1

    return (
        <button type="button" className="group text-left w-full rounded-xl hover:bg-muted/30" onClick={() => coverImage && onOpenLightbox(item, 0)}>
            {/* Image area */}
            {coverImage ? (
                <div className="relative h-64 rounded-xl overflow-hidden mb-4 shadow-sm hover:shadow-lg transition-shadow">
                    <Image src={coverImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300"/>

                    {/* Year badge */}
                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-semibold shadow">
                        {item.year}
                    </div>

                    {/* Multi-image indicator */}
                    {extraCount > 0 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Images className="w-3 h-3" />
                        +{extraCount}
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        {extraCount > 0 && (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                            View {allImages.length} photos
                        </span>
                        )}
                    </div>
                </div>
            ) : (
                <div className="relative h-64 bg-gradient-to-br from-primary to-primary/50 rounded-xl overflow-hidden mb-4 hover:shadow-lg transition-shadow">
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/40 group-hover:bg-primary/60 transition-colors">
                        <div className="text-6xl text-primary-foreground/20">✦</div>
                    </div>

                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                        {item.year}
                    </div>
                </div>
            )}

            <div className="px-3 pb-2">
                <h3 className="font-serif text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colorsbg-accent/50">
                    {item.title}
                </h3>

                {item.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {item.description}
                    </p>
                )}
            </div>
        </button>
    )
}