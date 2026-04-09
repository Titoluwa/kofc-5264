import { Newsletter, CATEGORY_COLORS } from "@/lib/constants";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Edit2, Trash2, FileText } from "lucide-react";
import Image from "next/image";

export function NewsletterCard({ nl, onEdit, onDelete, }: Readonly<{ nl: Newsletter; onEdit: (nl: Newsletter) => void; onDelete: (id: number) => void;}>) {
    const catColor = nl.category ? (CATEGORY_COLORS[nl.category] ?? null) : null;
    const dateStr  = nl.publishedDate ?? nl.createdAt;
    const date     = dateStr
        ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '';
    const contentPreview = nl.content?.slice(0, 140).trim() ?? '';
    const excerpt        = nl.content && nl.content.length > 140 ? contentPreview + '…' : contentPreview;
    const preview  = nl.content ? excerpt : (nl.file?.split('/').pop() ?? '');

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {/* Hero image */}
            <div className="relative h-44 bg-muted shrink-0">
                {nl.heroImage ? (
                <Image src={nl.heroImage} alt={nl.title} fill className="object-cover" />
                ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                    <FileText className="w-10 h-10 text-primary/30" />
                </div>
                )}
                {/* Category badge */}
                {nl.category && catColor && (
                <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${catColor.bg} ${catColor.text} ${catColor.border} shadow-sm`}>
                    {nl.category}
                    </span>
                </div>
                )}
                {/* Date badge */}
                {date && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    {date}
                </div>
                )}
            </div>

            <CardHeader className="pb-2 flex-1">
                <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                    <CardTitle className="text-base leading-snug truncate">{nl.title}</CardTitle>
                    {nl.subtitle && (
                    <CardDescription className="mt-1 text-xs line-clamp-1">{nl.subtitle}</CardDescription>
                    )}
                    <p className={"text-xs text-muted-foreground mt-2 leading-relaxed" + (nl.content ? " line-clamp-2" : "")}>
                    {preview}
                    </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                    <Button
                    variant="outline" size="icon" className="h-8 w-8"
                    onClick={() => onEdit(nl)} title="Edit"
                    >
                    <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                    variant="outline" size="icon"
                    className="h-8 w-8 hover:bg-destructive/10 hover:border-destructive hover:text-destructive"
                    onClick={() => onDelete(nl.id)} title="Delete"
                    >
                    <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
                </div>
            </CardHeader>
        </Card>
    );
}