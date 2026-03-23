import { useState } from "react";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import Image from "next/image";

export function AdditionalImages({ images, onChange }: Readonly<{ images: string[]; onChange: (imgs: string[]) => void; }>) {
    const [addingNew, setAddingNew] = useState(false);
    const [newUrl, setNewUrl] = useState('');

    const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx));

    const commitNew = (url: string) => {
        if (url) onChange([...images, url]);
        setNewUrl('');
        setAddingNew(false);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Additional Images <span className="text-muted-foreground font-normal">({images.length})</span></Label>
                {!addingNew && (
                    <Button type="button" variant="outline" size="sm" onClick={() => setAddingNew(true)}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Image
                    </Button>
                )}
            </div>

            {/* Existing thumbnails */}
            {images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                {images.map((src, idx) => (
                    <div key={idx + 1} className="relative group h-20 rounded-md overflow-hidden border border-border">
                        <Image src={src} alt={`Extra ${idx + 1}`} fill className="object-cover" />
                        <button type="button" onClick={() => remove(idx)} className="absolute top-1 right-1 bg-black/60 hover:bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
                </div>
            )}

            {/* New image upload panel */}
            {addingNew && (
                <div className="border border-dashed border-border rounded-lg p-3 space-y-2 bg-muted/30">
                    <ImageUpload value={newUrl} onChange={url => setNewUrl(url)} label="Upload or paste URL"/>
                    <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" size="sm" onClick={() => { setAddingNew(false); setNewUrl(''); }}>
                            Cancel
                        </Button>
                        <Button type="button" size="sm" onClick={() => commitNew(newUrl)} disabled={!newUrl}>
                            Add
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}