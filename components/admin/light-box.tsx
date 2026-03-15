"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"


export default function Lightbox({ images, initialIndex, title, onClose }: Readonly<{ images: string[], initialIndex: number, title: string, onClose: () => void }>) {
  
    const [idx, setIdx] = useState(initialIndex)

    const prev = () => setIdx((i) => (i - 1 + images.length) % images.length)
    const next = () => setIdx((i) => (i + 1) % images.length)

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") prev()
        if (e.key === "ArrowRight") next()
        }

        globalThis.addEventListener("keydown", handler)
        return () => globalThis.removeEventListener("keydown", handler)
    }, [images.length])

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl bg-black/95 border-none p-4">
                <div className="relative">

                {/* Image */}
                <div className="relative h-[70vh] rounded-xl overflow-hidden bg-black">
                    <Image src={images[idx]} alt={`${title} — ${idx + 1}`} fill className="object-contain"/>
                </div>

                {/* Caption */}
                <p className="text-center text-white/60 text-sm mt-3">
                    {title} — {idx + 1} / {images.length}
                </p>

                {/* Arrows */}
                {images.length > 1 && (
                    <>
                    <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2">
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                    </>
                )}

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="flex gap-2 justify-center mt-4 flex-wrap">
                        {images.map((src, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setIdx(i)}
                                className={`relative h-12 w-16 rounded overflow-hidden border-2 ${
                                    i === idx
                                    ? "border-white opacity-100"
                                    : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                            >
                                <Image src={src} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
                </div>
            </DialogContent>
        </Dialog>
    )
}